// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract OmniSend {
    address private operator;
    bytes32 public recipient;

    constructor() {
        operator = msg.sender;
    }

    function burn(address _outbox, uint32 _destination, bytes32 _recipient, address _addr) external payable {
        require(
            msg.sender == operator,
            "Only operators can send messages"
        );
        IMailbox mailbox = IMailbox(_outbox);
        bytes32 messageId = mailbox.dispatch{value: msg.value}(
            _destination,
            _recipient,
            abi.encodePacked(_addr)
        );
    }
    
    function update(address _outbox, uint32 _destination, bytes32 _recipient, address _addr) external payable {
        require(
            msg.sender == operator,
            "Only operators can send messages"
        );
        IMailbox mailbox = IMailbox(_outbox);
        bytes32 messageId = mailbox.dispatch{value: msg.value}(
            _destination,
            _recipient,
            abi.encodePacked(_addr)
        );
    }
}
