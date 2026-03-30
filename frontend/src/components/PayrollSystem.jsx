import React, { useState } from 'react';
import { 
  Download, CreditCard, DollarSign, TrendingUp, 
  ArrowDownCircle, Receipt, Building, Briefcase,
  Calendar, User
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PayrollSystem = () => {
  const userStr = localStorage.getItem('user');
  let user = {};
  try {
    user = JSON.parse(userStr || '{}');
  } catch (e) {
    user = {};
  }

  const [salaryData] = useState({
    basic: 50000,
    hra: 20000,
    bonus: 5000,
    allowance: 10000,
    tax: 8500,
    pf: 6000,
    insurance: 2000,
    month: "March 2026",
    paymentDate: "March 30, 2026",
    transactionId: "TXN9823471023",
    bank: "HDFC Bank"
  });

  const totalEarnings = salaryData.basic + salaryData.hra + salaryData.bonus + salaryData.allowance;
  const totalDeductions = salaryData.tax + salaryData.pf + salaryData.insurance;
  const netSalary = totalEarnings - totalDeductions;

  const downloadPayslip = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 27, 75); // Navy color #1E1B4B
    doc.text("EMS Platform", 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text("Official Salary Payslip", 105, 30, { align: 'center' });
    
    // Employee Info
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 40, 190, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Employee Name: ${user.name || 'Test User'}`, 20, 50);
    doc.text(`Role: ${user.role || 'Standard Employee'}`, 20, 57);
    doc.text(`Month: ${salaryData.month}`, 140, 50);
    doc.text(`Date: ${salaryData.paymentDate}`, 140, 57);
    
    // Earnings Table
    doc.autoTable({
      startY: 70,
      head: [['Earnings', 'Amount']],
      body: [
        ['Basic Salary', `$${salaryData.basic.toLocaleString()}`],
        ['HRA', `$${salaryData.hra.toLocaleString()}`],
        ['Bonus', `$${salaryData.bonus.toLocaleString()}`],
        ['Special Allowance', `$${salaryData.allowance.toLocaleString()}`],
        ['Total Earnings', `$${totalEarnings.toLocaleString()}`],
      ],
      headStyles: { fillColor: [61, 59, 142] }, // Purple color #3D3B8E
    });

    // Deductions Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Deductions', 'Amount']],
      body: [
        ['Income Tax', `$${salaryData.tax.toLocaleString()}`],
        ['Provident Fund', `$${salaryData.pf.toLocaleString()}`],
        ['Health Insurance', `$${salaryData.insurance.toLocaleString()}`],
        ['Total Deductions', `$${totalDeductions.toLocaleString()}`],
      ],
      headStyles: { fillColor: [239, 68, 68] }, // Red color
    });

    // Net Salary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFillColor(243, 244, 246);
    doc.rect(20, finalY, 170, 20, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Net Salary Payable: $${netSalary.toLocaleString()}`, 105, finalY + 13, { align: 'center' });

    doc.save(`Payslip_${salaryData.month.replace(' ', '_')}.pdf`);
  };

  const colors = {
    primary: '#1E1B4B',
    accent: '#3D3B8E',
    success: '#10B981',
    error: '#EF4444',
    bg: '#F9FAFB',
    textMuted: '#6B7280'
  };

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F3F4F6', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>Payroll Management</h1>
          <p style={{ color: colors.textMuted }}>Overview of your compensation and benefits</p>
        </div>
        <button 
          onClick={downloadPayslip}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: colors.accent,
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Download size={18} />
          Download Payslip
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard icon={DollarSign} label="Net Salary" value={`$${netSalary.toLocaleString()}`} color={colors.success} />
        <StatCard icon={TrendingUp} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} color={colors.accent} />
        <StatCard icon={ArrowDownCircle} label="Total Deductions" value={`$${totalDeductions.toLocaleString()}`} color={colors.error} />
        <StatCard icon={Calendar} label="Payment Date" value={salaryData.paymentDate} color={colors.primary} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Salary Breakdown */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={20} /> Salary Breakdown
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <BreakdownItem label="Basic Salary" value={salaryData.basic} total={totalEarnings} />
            <BreakdownItem label="House Rent Allowance (HRA)" value={salaryData.hra} total={totalEarnings} />
            <BreakdownItem label="Performance Bonus" value={salaryData.bonus} total={totalEarnings} />
            <BreakdownItem label="Special Allowance" value={salaryData.allowance} total={totalEarnings} />
            
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: colors.primary }}>
              <span>Total Gross Earnings</span>
              <span>${totalEarnings.toLocaleString()}</span>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '32px 0 20px', color: colors.error, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowDownCircle size={20} /> Deductions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <BreakdownItem label="Income Tax" value={salaryData.tax} total={totalEarnings} isDeduction />
            <BreakdownItem label="Provident Fund" value={salaryData.pf} total={totalEarnings} isDeduction />
            <BreakdownItem label="Health Insurance" value={salaryData.insurance} total={totalEarnings} isDeduction />
            
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: colors.error }}>
              <span>Total Deductions</span>
              <span>-${totalDeductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Payment Method</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ backgroundColor: '#E0E7FF', padding: '12px', borderRadius: '8px', color: colors.accent }}>
                <CreditCard size={24} />
              </div>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '2px' }}>{salaryData.bank}</p>
                <p style={{ fontSize: '12px', color: colors.textMuted }}>Trans. ID: {salaryData.transactionId}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: colors.primary }}>Employee Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InfoRow icon={User} label="Name" value={user.name || 'Test User'} />
              <InfoRow icon={Briefcase} label="Designation" value={user.role === 'admin' ? 'Administrator' : 'Software Engineer'} />
              <InfoRow icon={Building} label="Department" value="Engineering" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}10`, color: color }}>
        <Icon size={20} />
      </div>
      <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>{label}</span>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{value}</div>
  </div>
);

const BreakdownItem = ({ label, value, total, isDeduction }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
      <span style={{ color: '#374151' }}>{label}</span>
      <span style={{ fontWeight: '600', color: isDeduction ? '#EF4444' : '#111827' }}>
        {isDeduction ? '-' : ''}${value.toLocaleString()}
      </span>
    </div>
    <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ 
        height: '100%', 
        width: `${(value / total) * 100}%`, 
        backgroundColor: isDeduction ? '#EF4444' : '#3D3B8E',
        borderRadius: '3px'
      }} />
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <Icon size={18} color="#9CA3AF" />
    <div style={{ fontSize: '14px' }}>
      <span style={{ color: '#6B7280', marginRight: '8px' }}>{label}:</span>
      <span style={{ fontWeight: '500', color: '#111827' }}>{value}</span>
    </div>
  </div>
);

export default PayrollSystem;
