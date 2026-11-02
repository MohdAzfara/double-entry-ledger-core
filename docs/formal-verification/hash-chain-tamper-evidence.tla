---------------- MODULE HashChainTamperEvidence ----------------
EXTENDS Naturals, Sequences

CONSTANTS MaxEntries

VARIABLES 
    ledgerChain,
    sealedHeadDigest

vars == <<ledgerChain, sealedHeadDigest>>

ComputeDigest(prevDigest, seqNum, payloadId) ==
    (prevDigest * 31 + seqNum * 17 + payloadId) % 1000000007

Init ==
    /\ ledgerChain = << >>
    /\ sealedHeadDigest = 0

AppendJournalBatch(payloadId) ==
    /\ Len(ledgerChain) < MaxEntries
    /\ LET nextSeq == Len(ledgerChain) + 1
           newDigest == ComputeDigest(sealedHeadDigest, nextSeq, payloadId)
           entry == [seq |-> nextSeq, prevHash |-> sealedHeadDigest, hash |-> newDigest, payload |-> payloadId]
       IN /\ ledgerChain' = Append(ledgerChain, entry)
          /\ sealedHeadDigest' = newDigest

Next ==
    \E pid \in 1..500 : AppendJournalBatch(pid)

\* Invariant: Every entry i > 1 in the ledger chain must reference entry (i-1)'s exact cryptographic hash
HashChainContinuityInvariant ==
    \A i \in 2..Len(ledgerChain) :
        ledgerChain[i].prevHash = ledgerChain[i - 1].hash

Spec == Init /\ [][Next]_vars
=============================================================================
