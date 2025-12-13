/**
 * DATA - Definice hodnot pro generování (převzato z Assignment 3)
 * Obsahuje pole pro pohlaví, úvazky, jména a příjmení.
 */
const DATA = {
  genders: ["male", "female"],
  workloads: [10, 20, 30, 40],
  names: {
    male: ["Jan", "Petr", "Martin", "Tomáš", "Lukáš", "Jakub"],
    female: ["Jana", "Eva", "Hana", "Anna", "Lenka", "Lucie"]
  },
  surnames: ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera"]
};

/**
 * Pomocná funkce pro náhodný výběr položky z pole.
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pomocná funkce: Vypočítá věk na základě data narození.
 * Využívá rozdíl v milisekundách mezi "teď" a datem narození.
 */
function calculateAge(birthdateStr) {
  const birthDate = new Date(birthdateStr);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs); // milisekundy od epochy
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Pomocná funkce: Vypočítá medián z pole čísel.
 * Nutné pro medián věku a medián úvazku.
 */
function calculateMedian(values) {
  if (values.length === 0) return 0;
  
  // Seřadíme pole vzestupně (číselně)
  // Používáme spread operator [...values], abychom neovlivnili původní pole
  const sorted = [...values].sort((a, b) => a - b);
  
  const half = Math.floor(sorted.length / 2);
  
  // Pokud je počet prvků lichý, vrátíme prostřední
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  
  // Pokud je počet prvků sudý, vrátíme průměr dvou prostředních
  return (sorted[half - 1] + sorted[half]) / 2.0;
}

/**
 * 1. FUNKCE GENERÁTORU
 * Generuje seznam zaměstnanců na základě vstupních dat (dtoIn).
 */
function generateEmployeeData(dtoIn) {
  const minAge = dtoIn.age.min;
  const maxAge = dtoIn.age.max;
  let dtoOut = [];
  let counter = dtoIn.count;

  // Funkce pro generování náhodného data narození v ISO formátu
  function generateRandomBirthdate() {
    const now = new Date();
    
    // Nejméně dávné datum (pro nejmladšího člověka = minAge)
    const maxDateLimit = new Date();
    maxDateLimit.setFullYear(now.getFullYear() - minAge);

    // Nejvíce dávné datum (pro nejstaršího člověka = maxAge)
    const minDateLimit = new Date();
    minDateLimit.setFullYear(now.getFullYear() - maxAge);

    // Náhodný čas mezi těmito limity
    const randomTime = minDateLimit.getTime() + Math.random() * (maxDateLimit.getTime() - minDateLimit.getTime());
    return new Date(randomTime).toISOString();
  }

  // Smyčka pro vytvoření požadovaného počtu zaměstnanců
  while (counter > 0) {
    const gender = getRandomItem(DATA.genders);
    const name = getRandomItem(DATA.names[gender]);
    const surname = getRandomItem(DATA.surnames);
    const birthdate = generateRandomBirthdate();
    const workload = getRandomItem(DATA.workloads);

    // Vytvoření objektu zaměstnance
    dtoOut.push({
      gender: gender,
      birthdate: birthdate,
      name: name,
      surname: surname,
      workload: workload
    });
    counter--;
  }
  
  return dtoOut;
}

/**
 * 2. FUNKCE STATISTIKY
 * Přijímá seznam zaměstnanců a počítá statistické údaje.
 */
function getEmployeeStatistics(employees) {
  // Připravíme si pole věků a úvazků pro jednodušší výpočty
  const ages = employees.map(e => calculateAge(e.birthdate));
  const workloads = employees.map(e => e.workload);
  
  // Získáme pouze úvazky žen pro specifický výpočet
  const womenWorkloads = employees
    .filter(e => e.gender === "female")
    .map(e => e.workload);

  // --- Výpočet počtů dle úvazku ---
  const workloadCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };
  workloads.forEach(w => {
    if (workloadCounts[w] !== undefined) {
      workloadCounts[w]++;
    }
  });

  // --- Výpočet průměrného věku ---
  const totalAge = ages.reduce((sum, age) => sum + age, 0);
  const averageAge = ages.length ? totalAge / ages.length : 0;

  // --- Výpočet průměrného úvazku žen ---
  const totalWomenWorkload = womenWorkloads.reduce((sum, w) => sum + w, 0);
  const averageWomenWorkload = womenWorkloads.length ? totalWomenWorkload / womenWorkloads.length : 0;

  // --- Seřazení zaměstnanců dle úvazku (od nejmenšího) ---
  // Vytvoříme kopii pole [...employees], abychom neměnili původní data, a seřadíme
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  // --- Sestavení výsledného objektu (dtoOut) ---
  return {
    total: employees.length,                  // Celkový počet
    workload10: workloadCounts[10],           // Počet úvazků 10
    workload20: workloadCounts[20],           // Počet úvazků 20
    workload30: workloadCounts[30],           // Počet úvazků 30
    workload40: workloadCounts[40],           // Počet úvazků 40
    averageAge: parseFloat(averageAge.toFixed(1)), // Průměrný věk (1 des. místo)
    minAge: Math.min(...ages),                // Minimální věk
    maxAge: Math.max(...ages),                // Maximální věk
    medianAge: calculateMedian(ages),         // Medián věku
    medianWorkload: calculateMedian(workloads), // Medián úvazku
    averageWomenWorkload: parseFloat(averageWomenWorkload.toFixed(1)), // Průměr úvazku žen
    sortedByWorkload: sortedByWorkload        // Seřazený seznam
  };
}

/**
 * HLAVNÍ FUNKCE (Entry point)
 */
export function main(dtoIn) {
  // 1. Zavoláme funkci pro vygenerování dat
  const generatedData = generateEmployeeData(dtoIn);
  
  // 2. Zavoláme funkci pro výpočet statistik nad vygenerovanými daty
  const statistics = getEmployeeStatistics(generatedData);
  
  // 3. Vrátíme výsledek
  return statistics;
}

