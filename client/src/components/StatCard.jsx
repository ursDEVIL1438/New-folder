import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent: 'bg-accent/10 text-accent',
        green: 'bg-green-500/10 text-green-600',
        orange: 'bg-orange-500/10 text-orange-600',
    };

    return (
        <div className=\"bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow\">
            < div className =\"flex items-start justify-between\">
                < div >
                <p className=\"text-sm font-medium text-gray-500 mb-1\">{title}</p>
                    < h3 className =\"text-2xl font-bold text-gray-900\">{value}</h3>
                </div >
    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
        <Icon size={24} />
    </div>
            </div >
    { trend && (
        <div className=\"mt-4 flex items-center text-sm\">
            < span className = {`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                { trend.isPositive ? '+' : '' }{ trend.value }%
                    </span >
    <span className=\"text-gray-400 ml-2\">from last month</span>
                </div >
            )}
        </div >
    );
};

export default StatCard;
