// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract OmniSend is Ownable {
    address private operator;
    bytes32 public recipient;

    struct State {
        address id,
        address soul
    }

    enum Action {
        Mint,
        Burn,
        Update
    }

    struct GeneratePass {
        Action action;
        State state;
    }

    IMailbox mailbox;
    event SentMessage(
        uint32 destinationDomain,
        bytes32 recipient,
        bytes message
    );

    constructor(address _operator,) Ownable(_operator) {
        operator = _operator;
    }

    function send(address _outbox, int _destination, string _recipient, Action _action, State memory _state) returns () {
        require(
            msg.sender == operator,
            "Only operators can send messages"
        );
        mailbox = IMailbox(_outbox);
        GeneratePass pass;
        pass.action = _action;
        pass.state = _state;
        bytes32 messageId = mailbox.dispatch{value: msg.value}(
            _destination,
            recipient,
            bytes(pass)
        );
    }
}
