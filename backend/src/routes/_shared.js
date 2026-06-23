import { retryBuildTx } from "../stellar.js";
import { recordTransaction, addAuditLog } from "../database/index.js";

/**
 * Shared pattern for transaction-building routes:
 * 1. Record transaction in database
 * 2. Build transaction XDR
 * 3. Log audit event
 * 4. Return XDR and transaction ID
 *
 * This eliminates duplication across initialize, distribute, and similar routes.
 */
export async function buildAndRecordTransaction({
  contractId,
  walletAddress,
  transactionType,
  contractMethod,
  scvlArgs,
  auditAction,
  auditMetadata,
  transactionMetadata = {},
}) {
  const method = contractMethod ?? transactionType;
  const transactionId = recordTransaction(
    contractId,
    transactionType,
    walletAddress,
    transactionMetadata
  );

  const txXdr = await retryBuildTx(walletAddress, contractId, method, scvlArgs);

  // Log the audit event
  addAuditLog(contractId, auditAction, walletAddress, {
    transactionId,
    ...auditMetadata,
  });

  return { xdr: txXdr, transactionId };
}
