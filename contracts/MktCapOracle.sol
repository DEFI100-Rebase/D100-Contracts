// SPDX-License-Identifier: MIT

pragma solidity >=0.5.16 <0.8.0;
import "./UsingTellor.sol";
import "./ITellor.sol";
import "./Oracle.sol";

contract MktCapOracle is UsingTellor {
    //This Contract now have access to all functions on UsingTellor

  uint256 tellorFeed;
  uint256 tellorId = 1;
    
    constructor(address payable _tellorAddress)
        public
        UsingTellor(_tellorAddress)
    {}

    function readTellorValue(uint256 _tellorID)
        external
        view
        returns (uint256)
    {
        //Helper function to get latest available value for that Id
        (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved) =
            getCurrentValue(1);
        if (!ifRetrieve) return 0;
        return value;
    }

    function readTellorValueBefore(uint256 _tellorId, uint256 _timestamp)
        external
        returns (uint256, uint256)
    {
        //Helper Function to get a value before the given timestamp
        (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved) =
            getDataBefore(_tellorId, _timestamp);
        if (!_ifRetrieve) return (0, 0);
        return (_value, _timestampRetrieved);
    }
}