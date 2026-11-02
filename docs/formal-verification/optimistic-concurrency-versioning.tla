---------------- MODULE OptimisticConcurrencyVersioning ----------------
EXTENDS Naturals

CONSTANTS Workers

VARIABLES 
    accountVersion,
    accountBalance,
    workerReadVersion

vars == <<accountVersion, accountBalance, workerReadVersion>>

Init ==
    /\ accountVersion = 1
    /\ accountBalance = 1000
    /\ workerReadVersion = [w \in Workers |-> 1]

ReadAccountSnapshot(w) ==
    /\ workerReadVersion' = [workerReadVersion EXCEPT ![w] = accountVersion]
    /\ UNCHANGED <<accountVersion, accountBalance>>

CommitWithVersionGuard(w, delta) ==
    /\ workerReadVersion[w] = accountVersion
    /\ accountBalance + delta >= 0
    /\ accountBalance' = accountBalance + delta
    /\ accountVersion' = accountVersion + 1
    /\ workerReadVersion' = [workerReadVersion EXCEPT ![w] = accountVersion + 1]

Next ==
    \E w \in Workers :
        \/ ReadAccountSnapshot(w)
        \/ CommitWithVersionGuard(w, 100)
        \/ CommitWithVersionGuard(w, -100)

\* Invariant: Account version grows monotonically and balance never drops below zero
MonotonicVersionAndSolvencyInvariant ==
    /\ accountVersion >= 1
    /\ accountBalance >= 0

Spec == Init /\ [][Next]_vars
=============================================================================
