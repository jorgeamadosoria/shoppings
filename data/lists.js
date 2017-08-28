module.exports = {

    currencies: ["UYU", "USD", "CUC", "CUP","ARS","CLP"],
    
    status: ["fa fa-check-circle-o text-success","fa fa-warning text-warning"],

    countries: ["Uruguay", "Chile", "Argentina", "Cuba"],

    categories: ["Food", "Bills", "Clothing", "Electronics", "Household", "Entertainment", "Transportation", "Health", "Housing", "Communications", "Personal", "Support", "Legal", "Education", "Debt", "Gifts", "Charity", "Luxury", "Esthetic"],

    reasons: ["Need", "Want", "Exploration", "Amal", "Lunch", "Dinner", "Breakfast", "Error"],

    types: ["Product","Service",  "Contribution", "Payment"],

    units: ["kg","cc",  "g", "mg", "m", "lt", "ml", "cc", "kg+", "-kg", "cm^2", "cm", "N/A"],

    prepare:function(list,item){
        var temp = list.slice();
        temp.splice(list.indexOf(item), 1);
        return temp;
    }
};
