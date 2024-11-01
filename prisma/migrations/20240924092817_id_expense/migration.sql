-- DropIndex
DROP INDEX "Expense_id_key";

-- AlterTable
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_pkey" PRIMARY KEY ("id");
