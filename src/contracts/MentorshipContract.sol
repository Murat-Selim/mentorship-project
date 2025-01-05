// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMentorshipNFT {
    function mintAchievement(
        address student,
        string memory title,
        string memory description,
        uint256 sessionId,
        address mentor
    ) external returns (uint256);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract MentorshipSystem {
    struct Mentor {
        address payable walletAddress;
        string name;
        string expertise;
        uint256 hourlyRate;
        bool isAvailable;
        uint256 rating;
        uint256 totalRatings;
        uint256[] sessionIds;
    }

    struct Student {
        address walletAddress;
        string name;
        bool isRegistered;
        address currentMentor;
        uint256[] sessionIds;
        uint256[] achievementIds;
    }

    struct Session {
        uint256 sessionId;
        address mentor;
        address student;
        uint256 startTime;
        uint256 duration;
        uint256 amount;
        bool isActive;
        bool isPaid;
        bool isCompleted;
        bool nftMinted;
    }

    mapping(address => Mentor) public mentors;
    mapping(address => Student) public students;
    mapping(uint256 => Session) public sessions;
    mapping(bytes32 => Session) public activeSessionsByHash;
    
    uint256 public platformFee = 5;
    address payable public platformWallet;
    uint256 public sessionCounter;
    IMentorshipNFT public nftContract;
    IERC20 public eduToken;
    
    event MentorRegistered(address indexed mentorAddress, string name, string expertise);
    event StudentRegistered(address indexed studentAddress, string name);
    event SessionStarted(address indexed mentor, address indexed student, uint256 indexed startTime);
    event SessionEnded(address indexed mentor, address indexed student, uint256 indexed endTime);
    event SessionCompleted(uint256 indexed sessionId);
    event PaymentProcessed(uint256 indexed sessionId, uint256 amount);
    event AchievementMinted(address indexed student, uint256 indexed tokenId, uint256 indexed sessionId);
    event MentorUpdated(address indexed mentorAddress, string name, string expertise, uint256 hourlyRate, bool isAvailable);

    modifier onlyPlatform() {
        require(msg.sender == platformWallet, "Only platformWallet can perform this action");
        _;
    }
    
    constructor(address _eduToken) {
        platformWallet = payable(msg.sender);
        sessionCounter = 0;
        eduToken = IERC20(_eduToken);
    }
    
    function setNFTContract(address _nftContract) external onlyPlatform {
        nftContract = IMentorshipNFT(_nftContract);
    }
    
    function registerMentor(
        string memory _name, 
        string memory _expertise, 
        uint256 _hourlyRate
    ) external {
        require(!mentors[msg.sender].isAvailable, "Mentor already registered");
        
        uint256[] memory emptyArray;
        mentors[msg.sender] = Mentor({
            walletAddress: payable(msg.sender),
            name: _name,
            expertise: _expertise,
            hourlyRate: _hourlyRate,
            isAvailable: true,
            rating: 0,
            totalRatings: 0,
            sessionIds: emptyArray
        });
        
        emit MentorRegistered(msg.sender, _name, _expertise);
    }
    
    // Öğrenci kayıt fonksiyonu - herkes kullanabilir
    function registerStudent(string memory _name) external {
        require(!students[msg.sender].isRegistered, "Student already registered");
        
        uint256[] memory emptySessionIds = new uint256[](0);
        uint256[] memory emptyAchievementIds = new uint256[](0);
        
        students[msg.sender] = Student({
            walletAddress: msg.sender,
            name: _name,
            isRegistered: true,
            currentMentor: address(0),
            sessionIds: emptySessionIds,
            achievementIds: emptyAchievementIds
        });
        
        emit StudentRegistered(msg.sender, _name);
    }
    
    function startSession(address _mentorAddress) external {
        require(students[msg.sender].isRegistered, "Student not registered");
        require(mentors[_mentorAddress].isAvailable, "Mentor not available");
        
        uint256 hourlyRate = mentors[_mentorAddress].hourlyRate;
        require(eduToken.allowance(msg.sender, address(this)) >= hourlyRate, "Insufficient EDU token allowance");
        require(eduToken.balanceOf(msg.sender) >= hourlyRate, "Insufficient EDU token balance");
        
        // Transfer EDU tokens from student to contract
        require(eduToken.transferFrom(msg.sender, address(this), hourlyRate), "EDU token transfer failed");
        
        uint256 sessionId = sessionCounter++;
        bytes32 sessionHash = keccak256(abi.encodePacked(_mentorAddress, msg.sender, block.timestamp));
        
        Session memory newSession = Session({
            sessionId: sessionId,
            mentor: _mentorAddress,
            student: msg.sender,
            startTime: block.timestamp,
            duration: 1 hours,
            amount: hourlyRate,
            isActive: true,
            isPaid: true,
            isCompleted: false,
            nftMinted: false
        });
        
        sessions[sessionId] = newSession;
        activeSessionsByHash[sessionHash] = newSession;
        
        mentors[_mentorAddress].sessionIds.push(sessionId);
        students[msg.sender].sessionIds.push(sessionId);
        
        students[msg.sender].currentMentor = _mentorAddress;
        mentors[_mentorAddress].isAvailable = false;
        
        emit SessionStarted(_mentorAddress, msg.sender, block.timestamp);
    }
    
    function endSession(address _studentAddress) external {
        require(msg.sender == mentors[msg.sender].walletAddress, "Only mentor can end session");
        
        // Find active session for this mentor and student
        uint256 activeSessionId;
        bool found = false;
        for (uint256 i = 0; i < mentors[msg.sender].sessionIds.length; i++) {
            uint256 sessionId = mentors[msg.sender].sessionIds[i];
            if (sessions[sessionId].student == _studentAddress && sessions[sessionId].isActive) {
                activeSessionId = sessionId;
                found = true;
                break;
            }
        }
        
        require(found, "Session not active");
        
        Session storage session = sessions[activeSessionId];
        session.isActive = false;
        session.isCompleted = true;
        mentors[msg.sender].isAvailable = true;
        students[_studentAddress].currentMentor = address(0);
        
        uint256 payment = session.amount;
        uint256 platformCut = (payment * platformFee) / 100;
        uint256 mentorPayment = payment - platformCut;
        
        // Transfer EDU tokens to platform and mentor
        require(eduToken.transfer(platformWallet, platformCut), "Platform fee transfer failed");
        require(eduToken.transfer(mentors[msg.sender].walletAddress, mentorPayment), "Mentor payment transfer failed");
        
        // NFT Ödülü Verme
        if (!session.nftMinted && address(nftContract) != address(0)) {
            string memory title = string(abi.encodePacked(
                "Session with ", mentors[msg.sender].name
            ));
            string memory description = string(abi.encodePacked(
                "Completed mentorship session in ", mentors[msg.sender].expertise
            ));
            
            uint256 tokenId = nftContract.mintAchievement(
                _studentAddress,
                title,
                description,
                session.sessionId,
                msg.sender
            );
            
            session.nftMinted = true;
            students[_studentAddress].achievementIds.push(tokenId);
            
            emit AchievementMinted(_studentAddress, tokenId, session.sessionId);
        }
        
        emit SessionEnded(msg.sender, _studentAddress, block.timestamp);
        emit SessionCompleted(session.sessionId);
        emit PaymentProcessed(session.sessionId, payment);
    }

    function updateMentor(
        address _mentorAddress,
        string memory _name,
        string memory _expertise,
        uint256 _hourlyRate,
        bool _isAvailable
    ) external onlyPlatform {
        require(mentors[_mentorAddress].walletAddress != address(0), "Mentor not registered");
        
        Mentor storage mentor = mentors[_mentorAddress];
        mentor.name = _name;
        mentor.expertise = _expertise;
        mentor.hourlyRate = _hourlyRate;
        mentor.isAvailable = _isAvailable;
        
        emit MentorUpdated(_mentorAddress, _name, _expertise, _hourlyRate, _isAvailable);
    }
    
    function rateMentor(address _mentorAddress, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(students[msg.sender].isRegistered, "Only registered students can rate");
        
        Mentor storage mentor = mentors[_mentorAddress];
        mentor.rating = ((mentor.rating * mentor.totalRatings) + _rating) / (mentor.totalRatings + 1);
        mentor.totalRatings++;
    }

    // View functions
    function getMentorRating(address _mentorAddress) external view returns (uint256, uint256) {
        return (mentors[_mentorAddress].rating, mentors[_mentorAddress].totalRatings);
    }

    function getMentorSessions(address _mentorAddress) external view returns (uint256[] memory) {
        return mentors[_mentorAddress].sessionIds;
    }

    function getStudentSessions() external view returns (uint256[] memory) {
        return students[msg.sender].sessionIds;
    }

    function updateMentorStatus(bool _isAvailable) external {
        require(mentors[msg.sender].walletAddress != address(0), "Not a registered mentor");
        mentors[msg.sender].isAvailable = _isAvailable;
    }

    function updateHourlyRate(uint256 _newRate) external {
        require(mentors[msg.sender].walletAddress != address(0), "Not a registered mentor");
        mentors[msg.sender].hourlyRate = _newRate;
    }

    // Platform yönetimi fonksiyonları
    function updatePlatformFee(uint256 _newFee) external onlyPlatform {
        require(_newFee <= 20, "Fee cannot exceed 20%");
        platformFee = _newFee;
    }

    function withdrawEmergency() external onlyPlatform {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        platformWallet.transfer(balance);
    }

    function withdrawEduTokenEmergency() external onlyPlatform {
        uint256 balance = eduToken.balanceOf(address(this));
        require(balance > 0, "No EDU tokens to withdraw");
        require(eduToken.transfer(platformWallet, balance), "Transfer failed");
    }
}
