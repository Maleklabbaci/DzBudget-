
import { UserData, BudgetCategory } from '../types';

export const calculateBudget = (userData: UserData): BudgetCategory[] => {
  const totalIncome = userData.salary + userData.otherIncome;
  const answers = userData.answers;

  // Default percentages
  let config = {
    housing: 0.25,
    food: 0.25,
    transport: 0.10,
    utilities: 0.10,
    education: 0.0,
    health: 0.05,
    familyHelp: 0.0,
    leisure: 0.08,
    debt: 0.0,
    savings: 0.17
  };

  // 1. Adjust for Housing (Question 4)
  if (answers[4] === 3) { // Logement familial
    config.housing = 0.0;
    config.savings += 0.15;
    config.leisure += 0.05;
    config.familyHelp += 0.05;
  } else if (answers[1] === 1) { // High cost city
    config.housing = 0.30;
    config.food += 0.02;
    config.savings -= 0.07;
  }

  // 2. Adjust for Transport (Question 6)
  if (answers[6] === 1) config.transport = 0.15;
  else if (answers[6] === 5) config.transport = 0.02;

  // 3. Adjust for Kids/Education (Question 12 and 3)
  const specialExpenses = (answers[12] as number[]) || [];
  if (specialExpenses.includes(1) || specialExpenses.includes(2) || answers[3] > 1) {
    config.education = 0.12;
    config.savings -= 0.06;
    config.leisure -= 0.06;
  }

  // 4. Adjust for Health (Question 12)
  if (specialExpenses.includes(3)) {
    config.health += 0.05;
    config.savings -= 0.05;
  }

  // 5. Adjust for Family (Question 12)
  if (specialExpenses.includes(4)) {
    config.familyHelp += 0.10;
    config.savings -= 0.05;
    config.leisure -= 0.05;
  }

  // 6. Adjust for Debt (Question 10/11)
  if (answers[10] !== 1) {
    let debtRatio = 0.10;
    if (answers[11] === 2) debtRatio = 0.20;
    if (answers[11] === 3) debtRatio = 0.35;
    
    config.debt = debtRatio;
    config.leisure = Math.max(0.02, config.leisure - (debtRatio / 2));
    config.savings = Math.max(0.05, config.savings - (debtRatio / 2));
  }

  // 7. Management Style (Question 14)
  if (answers[14] === 1) { // Strict
    config.savings += 0.07;
    config.leisure = Math.max(0.02, config.leisure - 0.07);
  } else if (answers[14] === 3) { // Comfortable
    config.savings = Math.max(0.05, config.savings - 0.05);
    config.leisure += 0.05;
  }

  // Ensure total is 1.0 (Normalization)
  const totalWeight = Object.values(config).reduce((a, b) => a + b, 0);
  const categories: BudgetCategory[] = [
    { id: 'logement', name: { fr: 'Logement', ar: 'السكن' }, budgeted: (config.housing / totalWeight) * totalIncome, spent: 0 },
    { id: 'nourriture', name: { fr: 'Nourriture & Hygiène', ar: 'الغذاء والنظافة' }, budgeted: (config.food / totalWeight) * totalIncome, spent: 0 },
    { id: 'transport', name: { fr: 'Transport', ar: 'النقل' }, budgeted: (config.transport / totalWeight) * totalIncome, spent: 0 },
    { id: 'factures', name: { fr: 'Factures & Abonnements', ar: 'الفواتير والاشتراكات' }, budgeted: (config.utilities / totalWeight) * totalIncome, spent: 0 },
    { id: 'education', name: { fr: 'Enfants & Éducation', ar: 'الأطفال والتعليم' }, budgeted: (config.education / totalWeight) * totalIncome, spent: 0 },
    { id: 'sante', name: { fr: 'Santé', ar: 'الصحة' }, budgeted: (config.health / totalWeight) * totalIncome, spent: 0 },
    { id: 'famille', name: { fr: 'Aide à la Famille', ar: 'مساعدة العائلة' }, budgeted: (config.familyHelp / totalWeight) * totalIncome, spent: 0 },
    { id: 'loisirs', name: { fr: 'Loisirs & Sorties', ar: 'الترفيه والخرجات' }, budgeted: (config.leisure / totalWeight) * totalIncome, spent: 0 },
    { id: 'dettes', name: { fr: 'Dettes & Crédits', ar: 'الديون والقروض' }, budgeted: (config.debt / totalWeight) * totalIncome, spent: 0 },
    { id: 'epargne', name: { fr: 'Épargne & Projets', ar: 'الادخار والمشاريع' }, budgeted: (config.savings / totalWeight) * totalIncome, spent: 0 }
  ];

  return categories.filter(c => c.budgeted > 0);
};
