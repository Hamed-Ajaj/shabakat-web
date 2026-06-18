export interface DashboardSummary {
  totalBilledThisMonth: number;
  totalCollectedThisMonth: number;
  totalOutstandingAllTime: number;
  collectionRate: number;
  totalExpensesThisMonth: number;
  netIncomeThisMonth: number;
  customers: {
    total: number;
    active: number;
    suspended: number;
    terminated: number;
    ampereCount: number;
    kilowattCount: number;
  };
  invoices: {
    unpaidCount: number;
    unpaidTotal: number;
    partiallyPaidCount: number;
    partiallyPaidTotal: number;
    paidCount: number;
    paidTotal: number;
  };
  expensesByType: {
    fuel: number;
    maintenance: number;
    employees: number;
    other: number;
  };
}

export interface DashboardInvoiceItem {
  id: string;
  invoiceNumber: number;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
}
