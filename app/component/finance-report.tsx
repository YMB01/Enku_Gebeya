import React, { Component, ChangeEvent } from 'react';
import { FaChartPie, FaChartBar, FaFilePdf, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import styles from './Reporting.module.css';

declare global {
  interface Window {
    domtoimage: any;
  }
}

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, ChartDataLabels);

interface Income {
  id: number;
  date: string;
  source: string;
  description: string;
  amount: number;
}

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface Sale {
  id: number;
  date: string;
  customerName: string;
  itemSold: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface State {
  incomeEntries: Income[];
  expenses: Expense[];
  sales: Sale[];
  startDate: string;
  endDate: string;
  loading: boolean;
  error: string | null;
  windowWidth: number;
}

export default class Reporting extends Component<{}, State> {
  state: State;
  private incomeExpensePieChartRef = React.createRef<ChartJS<'pie', number[], string>>();
  private expenseCategoryPieChartRef = React.createRef<ChartJS<'pie', number[], string>>();
  private monthlyNetProfitBarChartRef = React.createRef<ChartJS<'bar', number[], string>>();

  constructor(props: {}) {
    super(props);
    this.state = {
      incomeEntries: [],
      expenses: [],
      sales: [],
      startDate: this.getStartOfMonth(),
      endDate: this.getEndOfMonth(),
      loading: true,
      error: null,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    };
  }

  componentDidMount() {
    this.fetchData();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      this.setState({ windowWidth: window.innerWidth });
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const [incomeRes, expensesRes, salesRes] = await Promise.all([
        fetch('http://localhost:34393/api/Income'),
        fetch('http://localhost:34393/api/Expenses'),
        fetch('http://localhost:34393/api/Sales'),
      ]);

      if (!incomeRes.ok) throw new Error(`HTTP error! status: ${incomeRes.status} from Income API`);
      if (!expensesRes.ok) throw new Error(`HTTP error! status: ${expensesRes.status} from Expenses API`);
      if (!salesRes.ok) throw new Error(`HTTP error! status: ${salesRes.status} from Sales API`);

      const incomeData: Income[] = await incomeRes.json();
      const expensesData: Expense[] = await expensesRes.json();
      const salesData: Sale[] = await salesRes.json();

      this.setState({
        incomeEntries: incomeData,
        expenses: expensesData,
        sales: salesData,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      this.setState({
        error: `Failed to load data: ${error.message}`,
        loading: false,
      });
      toast.error(`Error: ${error.message}`);
    }
  };

  getStartOfMonth = (): string => {
    const today = new Date();
    today.setDate(1);
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };

  getEndOfMonth = (): string => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      this.setState({ [name]: value } as Pick<State, 'startDate' | 'endDate'>);
    }
  };

  filterDataByDateRange = <T extends { date: string }>(data: T[]): T[] => {
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) {
      return data;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getTime() >= start.getTime() && itemDate.getTime() <= end.getTime();
    });
  };

  calculateTotals = () => {
    const filteredIncome = this.filterDataByDateRange(this.state.incomeEntries);
    const filteredExpenses = this.filterDataByDateRange(this.state.expenses);
    const filteredSales = this.filterDataByDateRange(this.state.sales);

    const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSalesRevenue = filteredSales.reduce((sum, item) => sum + item.totalAmount, 0);
    const netProfit = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      totalSalesRevenue,
      filteredIncome,
      filteredExpenses,
      filteredSales,
    };
  };

  getIncomeExpensePieChartData = () => {
    const { totalIncome, totalExpenses } = this.calculateTotals();
    return {
      labels: ['Total Income', 'Total Expenses'],
      datasets: [
        {
          data: [totalIncome, totalExpenses],
          backgroundColor: ['#34D399', '#F87171'],
          borderColor: ['#FFFFFF', '#FFFFFF'],
          borderWidth: 2,
        },
      ],
    };
  };

  getExpenseCategoryPieChartData = () => {
    const { filteredExpenses } = this.calculateTotals();
    const expenseCategories = filteredExpenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);
    const backgroundColors = [
      '#F87171', '#60A5FA', '#FBBF24', '#34D399', '#A78BFA',
      '#F472B6', '#6EE7B7', '#F59E0B', '#10B981', '#3B82F6',
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
      ],
    };
  };

  getMonthlyNetProfitBarChartData = () => {
    const { filteredIncome, filteredExpenses } = this.calculateTotals();
    const allTransactions = [...filteredIncome, ...filteredExpenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    allTransactions.forEach(item => {
      const monthYear = item.date.substring(0, 7);
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      if ('source' in item) {
        monthlyData[monthYear].income += item.amount;
      } else {
        monthlyData[monthYear].expense += item.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    });

    const incomes = sortedMonths.map(month => monthlyData[month].income);
    const expensesData = sortedMonths.map(month => monthlyData[month].expense);
    const netProfits = sortedMonths.map(month => monthlyData[month].income - monthlyData[month].expense);

    return {
      labels,
      datasets: [
        {
          label: 'Total Income',
          data: incomes,
          backgroundColor: 'rgba(52, 211, 153, 0.7)',
          borderColor: 'rgba(52, 211, 153, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Expenses',
          data: expensesData,
          backgroundColor: 'rgba(248, 113, 113, 0.7)',
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
        },
        {
          label: 'Net Profit/Loss',
          data: netProfits,
          backgroundColor: netProfits.map(profit =>
            profit >= 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(248, 113, 113, 0.7)'
          ),
          borderColor: netProfits.map(profit =>
            profit >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(248, 113, 113, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  exportToPdf = async () => {
    const input = document.getElementById('report-content');
    if (!input) {
      toast.error("Report content element not found!");
      return;
    }

    if (typeof window === 'undefined' || typeof window.domtoimage === 'undefined') {
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/dom-to-image-more@2.12.0/dist/dom-to-image-more.min.js';
          script.onload = () => resolve();
          script.onerror = (e) => reject(new Error(`Failed to load dom-to-image-more: ${e}`));
          document.head.appendChild(script);
        });
      } catch (error) {
        console.error("Error loading dom-to-image-more library:", error);
        toast.error("Failed to load PDF export library.");
        return;
      }
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const originalBodyBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#FFFFFF';

    try {
      const imgData = await window.domtoimage.toPng(input, {
        quality: 0.95,
        bgcolor: '#F8FAFC',
        width: input.offsetWidth,
        height: input.offsetHeight,
        style: {
          'background-color': '#F8FAFC',
        },
      });

      const img = new Image();
      img.src = imgData;

      await new Promise(resolve => { img.onload = resolve; });

      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = pdfWidth / imgWidth;
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      let heightLeft = scaledHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, scaledWidth, scaledHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - scaledHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, scaledWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      doc.save('financial_report.pdf');
      toast.success('Report exported as PDF!');
    } catch (error) {
      console.error("Error during PDF generation:", error);
      toast.error("Error generating PDF.");
    } finally {
      document.body.style.backgroundColor = originalBodyBackgroundColor;
    }
  };

  render() {
    const { startDate, endDate, loading, error, windowWidth } = this.state;
    const { totalIncome, totalExpenses, netProfit, totalSalesRevenue, filteredIncome, filteredExpenses, filteredSales } =
      this.calculateTotals();

    const incomeExpensePieData = this.getIncomeExpensePieChartData();
    const expenseCategoryPieData = this.getExpenseCategoryPieChartData();
    const monthlyNetProfitBarData = this.getMonthlyNetProfitBarChartData();

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              size: windowWidth < 640 ? 12 : 14,
              family: 'Inter, sans-serif',
            },
            color: '#1F2937',
          },
        },
        title: {
          display: true,
          text: 'Income vs. Expenses',
          font: {
            size: windowWidth < 640 ? 16 : 20,
            weight: 'bold' as const,
            family: 'Inter, sans-serif',
          },
          color: '#1F2937',
        },
        datalabels: {
          color: '#FFFFFF',
          font: {
            weight: 'bold' as const,
            size: windowWidth < 640 ? 12 : 14,
            family: 'Inter, sans-serif',
          },
          formatter: (value: number, context: any) => {
            const sum = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            return (value * 100 / sum).toFixed(1) + '%';
          },
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: { family: 'Inter, sans-serif', size: 14 },
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
          cornerRadius: 8,
        },
      },
    };

    const expenseCategoryPieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            font: {
              size: windowWidth < 640 ? 12 : 14,
              family: 'Inter, sans-serif',
            },
            color: '#1F2937',
          },
        },
        title: {
          display: true,
          text: 'Expenses by Category',
          font: {
            size: windowWidth < 640 ? 16 : 20,
            weight: 'bold' as const,
            family: 'Inter, sans-serif',
          },
          color: '#1F2937',
        },
        datalabels: {
          color: '#FFFFFF',
          font: {
            weight: 'bold' as const,
            size: windowWidth < 640 ? 12 : 14,
            family: 'Inter, sans-serif',
          },
          formatter: (value: number, context: any) => {
            const sum = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            return (value * 100 / sum).toFixed(1) + '%';
          },
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: { family: 'Inter, sans-serif', size: 14 },
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
          cornerRadius: 8,
        },
      },
    };

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              size: windowWidth < 640 ? 12 : 14,
              family: 'Inter, sans-serif',
            },
            color: '#1F2937',
          },
        },
        title: {
          display: true,
          text: 'Monthly Income, Expenses & Net Profit',
          font: {
            size: windowWidth < 640 ? 16 : 20,
            weight: 'bold' as const,
            family: 'Inter, sans-serif',
          },
          color: '#1F2937',
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: { family: 'Inter, sans-serif', size: 14 },
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
            font: {
              size: windowWidth < 640 ? 12 : 14,
              family: 'Inter, sans-serif',
            },
            color: '#1F2937',
          },
          stacked: false,
          ticks: {
            font: {
              size: windowWidth < 640 ? 10 : 12,
            },
            color: '#1F2937',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount (Birr)',
            font: {
              size: windowWidth < 640 ? 12 : 14,
              family: 'Inter, sans-serif',
            },
            color: '#1F2937',
          },
          beginAtZero: true,
          ticks: {
            font: {
              size: windowWidth < 640 ? 10 : 12,
            },
            color: '#1F2937',
          },
        },
      },
    };

    if (loading) {
      return (
        <div className={styles.container}>
          <p className={styles.loadingText}>Loading financial data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.container}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={this.fetchData} className={styles.retryButton}>
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h2 className={styles.title}>Financial Reports & Overview</h2>

        <div className={styles.filterCard}>
          <div className={styles.filterRow}>
            <div className={styles.inputGroup}>
              <FaSearch className={styles.inputIcon} />
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={this.handleChange}
                className={styles.dateInput}
                placeholder="Select start date"
              />
            </div>
            <div className={styles.inputGroup}>
              <FaSearch className={styles.inputIcon} />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={this.handleChange}
                className={styles.dateInput}
                placeholder="Select end date"
              />
            </div>
            <button onClick={this.exportToPdf} className={styles.exportButton}>
              <FaFilePdf /> Export to PDF
            </button>
          </div>
        </div>

        <div id="report-content" className={styles.reportContent}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Total Income</h3>
              <p className={`${styles.cardValue} ${styles.textGreen}`}>Birr {totalIncome.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Total Expenses</h3>
              <p className={`${styles.cardValue} ${styles.textRed}`}>Birr {totalExpenses.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Net Profit/Loss</h3>
              <p className={`${styles.cardValue} ${netProfit >= 0 ? styles.textGreen : styles.textRed}`}>
                Birr {netProfit.toFixed(2)}
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Total Sales Revenue</h3>
              <p className={`${styles.cardValue} ${styles.textBlue}`}>Birr {totalSalesRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionHeading}>
              <FaChartBar className={styles.icon} />
              Financial Overview
            </h3>
            <div className={styles.chartGrid}>
              <div className={styles.chartContainer}>
                {totalIncome > 0 || totalExpenses > 0 ? (
                  <Pie ref={this.incomeExpensePieChartRef} data={incomeExpensePieData} options={pieOptions} />
                ) : (
                  <p className={styles.noData}>No income or expense data available for pie chart.</p>
                )}
              </div>
              <div className={styles.chartContainer}>
                {filteredExpenses.length > 0 ? (
                  <Pie ref={this.expenseCategoryPieChartRef} data={expenseCategoryPieData} options={expenseCategoryPieOptions} />
                ) : (
                  <p className={styles.noData}>No expense data available for category breakdown.</p>
                )}
              </div>
              <div className={styles.chartContainer}>
                {filteredIncome.length > 0 || filteredExpenses.length > 0 ? (
                  <Bar ref={this.monthlyNetProfitBarChartRef} data={monthlyNetProfitBarData} options={barOptions} />
                ) : (
                  <p className={styles.noData}>No income or expense data available for monthly chart.</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionHeading}>Detailed Income Report</h3>
            {filteredIncome.length === 0 ? (
              <p className={styles.noData}>No income entries found for the selected date range.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Description</th>
                      <th className={styles.textRight}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncome.map(item => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.source}</td>
                        <td>{item.description}</td>
                        <td className={`${styles.textRight} ${styles.textGreen}`}>Birr {item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionHeading}>Detailed Expense Report</h3>
            {filteredExpenses.length === 0 ? (
              <p className={styles.noData}>No expense entries found for the selected date range.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th className={styles.textRight}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(item => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.category}</td>
                        <td>{item.description}</td>
                        <td className={`${styles.textRight} ${styles.textRed}`}>Birr {item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionHeading}>Detailed Sales Report</h3>
            {filteredSales.length === 0 ? (
              <p className={styles.noData}>No sales records found for the selected date range.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Item Sold</th>
                      <th>Qty</th>
                      <th className={styles.textRight}>Unit Price</th>
                      <th className={styles.textRight}>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map(item => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.customerName}</td>
                        <td>{item.itemSold}</td>
                        <td className={styles.textRight}>{item.quantity}</td>
                        <td className={styles.textRight}>Birr {item.unitPrice.toFixed(2)}</td>
                        <td className={`${styles.textRight} ${styles.textBlue}`}>Birr {item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}