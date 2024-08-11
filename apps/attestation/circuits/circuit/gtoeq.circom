pragma circom 2.1.3;

include "../../node_modules/circomlib/circuits/comparators.circom";

template GreaterThanOrEqual(n) {
    signal input in[2];
    signal output against;
    signal output type;
    signal output out;
    
    against <== in[1];

    // Concatenate ASCII codes for gte
    var concatenated = 103 * 1000000 + 116 * 1000 + 101;

    type <== concatenated;
    component gte = GreaterEqThan(n);
    gte.in[0] <== in[0];
    gte.in[1] <== in[1];

    out <== gte.out;
}

component main = GreaterThanOrEqual(16);
