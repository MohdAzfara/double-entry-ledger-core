---------------- MODULE ZeroSumDoubleEntry ----------------
EXTENDS Integers, FiniteSets

CONSTANTS Accounts, MaxTransferAmount

VARIABLES 
    debitTotals,
    creditTotals,
    journalCount

vars == <<debitTotals, creditTotals, journalCount>>

SumSet(f, S) == 
    LET RECURSIVE Helper(_)
        Helper(T) == IF T = {} THEN 0
                     ELSE LET x == CHOOSE v \in T : TRUE
                          IN f[x] + Helper(T \ {x})
    IN Helper(S)

Init ==
    /\ debitTotals = [a \in Accounts |-> 0]
    /\ creditTotals = [a \in Accounts |-> 0]
    /\ journalCount = 0

PostBalancedJournal(debitAcct, creditAcct, amount) ==
    /\ debitAcct \in Accounts
    /\ creditAcct \in Accounts
    /\ debitAcct # creditAcct
    /\ amount > 0
    /\ debitTotals' = [debitTotals EXCEPT ![debitAcct] = @ + amount]
    /\ creditTotals' = [creditTotals EXCEPT ![creditAcct] = @ + amount]
    /\ journalCount' = journalCount + 1

Next ==
    \E dAcct, cAcct \in Accounts, amt \in 1..MaxTransferAmount :
        PostBalancedJournal(dAcct, cAcct, amt)

\* Fundamental Accounting Invariant: Global sum of all debits equals global sum of all credits
GlobalZeroSumInvariant ==
    SumSet(debitTotals, Accounts) = SumSet(creditTotals, Accounts)

\* Non-Negative Cumulative Postings Invariant
NonNegativePostingsInvariant ==
    \A a \in Accounts : debitTotals[a] >= 0 /\ creditTotals[a] >= 0

Spec == Init /\ [][Next]_vars
=============================================================================
