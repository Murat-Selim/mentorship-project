// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MentorshipNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Achievement {
        string title;
        string description;
        uint256 sessionId;
        address mentor;
        uint256 timestamp;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => bool) public authorizedMinters;

    event AchievementMinted(
        uint256 indexed tokenId,
        address indexed student,
        string title,
        uint256 sessionId,
        address mentor
    );

    constructor() ERC721("Mentorship Achievement", "MACH") Ownable(msg.sender) {}

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        _;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return exists(tokenId);
    }

    function setMinterRole(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }

    function mintAchievement(
        address student,
        string memory title,
        string memory description,
        uint256 sessionId,
        address mentor
    ) external onlyAuthorizedMinter returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(student, newTokenId);

        achievements[newTokenId] = Achievement({
            title: title,
            description: description,
            sessionId: sessionId,
            mentor: mentor,
            timestamp: block.timestamp
        });

        emit AchievementMinted(
            newTokenId,
            student,
            title,
            sessionId,
            mentor
        );

        return newTokenId;
    }

    function getAchievement(uint256 tokenId) external view returns (
        string memory title,
        string memory description,
        uint256 sessionId,
        address mentor,
        uint256 timestamp
    ) {
        require(exists(tokenId), "achievement query for nonexistent token");
        Achievement memory achievement = achievements[tokenId];
        return (
            achievement.title,
            achievement.description,
            achievement.sessionId,
            achievement.mentor,
            achievement.timestamp
        );
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(exists(tokenId), "achievement query for nonexistent token");
        
        Achievement memory achievement = achievements[tokenId];
        
        string memory json = string(abi.encodePacked(
            '{"name": "', achievement.title, '",',
            '"description": "', achievement.description, '",',
            '"attributes": [',
            '{"trait_type": "Session ID", "value": "', uint2str(achievement.sessionId), '"},',
            '{"trait_type": "Mentor", "value": "', addressToString(achievement.mentor), '"},',
            '{"trait_type": "Timestamp", "value": "', uint2str(achievement.timestamp), '"}',
            ']}'
        ));

        string memory output = string(abi.encodePacked(
            'data:application/json;base64,',
            base64Encode(bytes(json))
        ));

        return output;
    }

    // Helper functions
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 length = data.length;
        if (length == 0) return "";

        string memory result = new string(4 * ((length + 2) / 3));
        bytes memory resultBytes = bytes(result);

        uint256 j = 0;
        for (uint256 i = 0; i < length; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = i + 1 < length ? uint8(data[i + 1]) : 0;
            uint256 c = i + 2 < length ? uint8(data[i + 2]) : 0;

            uint256 triple = (a << 16) | (b << 8) | c;

            resultBytes[j] = bytes(table)[triple >> 18];
            resultBytes[j + 1] = bytes(table)[(triple >> 12) & 0x3F];
            resultBytes[j + 2] = i + 1 < length ? bytes(table)[(triple >> 6) & 0x3F] : bytes1("=");
            resultBytes[j + 3] = i + 2 < length ? bytes(table)[triple & 0x3F] : bytes1("=");

            j += 4;
        }

        return result;
    }
}