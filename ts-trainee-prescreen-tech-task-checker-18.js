const {
  core: { describe, it, expect, run },
  enzyme: { mount },
  prettify,
} = window.jestLite

const showNotification = () => {
  if (
    !window.calculateTeamFinanceReport &&
    !window.document.querySelector("div.notification")
  ) {
    const notificationNode = document.createElement("div")
    const textNode = document.createTextNode(
      "Please, put candidate's code in JS section"
    )
    notificationNode.appendChild(textNode)
    notificationNode.classList.add("notification")
    document.body.append(notificationNode)
  }
}

/**********************************************
    correctCalculateTeamFinanceReport
  ***********************************************/

window.correctCalculateTeamFinanceReport = (pricing, team) => {
  const fullFilds = team.map((item) => ({
    ...item,
    type: pricing[item.specialization],
    typePosition: item.specialization,
  }))

  const calculateSum = (percent, price) => +(price / (1 - percent / 100))

  const res = fullFilds.reduce(
    (total, item) => {
      const percent = parseInt(item.type.tax)
      const price = item.type.salary
      const resNumber = calculateSum(percent, price)
      total.totalBudgetTeam = total.totalBudgetTeam + resNumber
      if (!total[`totalBudget${item.typePosition}`])
        total[`totalBudget${item.typePosition}`] = 0
      total[`totalBudget${item.typePosition}`] =
        total[`totalBudget${item.typePosition}`] + resNumber
      return total
    },
    {
      totalBudgetTeam: 0,
    }
  )

  Object.entries(res).forEach(([key, val]) => {
    res[key] = ~~val
  })

  return res
}
/**********************************************
    correctCalculateTeamFinanceReport
  ***********************************************/

/**********************************************
    Tests
  ***********************************************/
window.tsTestsRun = () => {
    console.log("run tests")
    describe("Base tests", () => {
      console.log("Dima's tests")
      it("Dima's tests", () => {
        const pricing1 = {
          Progger: {
            salary: 100000, // without decimal counting system (100.5 or 99.99)
            tax: "25%", // max - 99 min - 0
          },
        }
        const team1 = [
          {
            specialization: "Progger",
            name: "Vasa",
          },
          {
            specialization: "Progger",
            name: "Dima",
          },
          {
            specialization: "Progger",
            name: "Sasha",
          },
          {
            specialization: "Progger",
            name: "Peter",
          },
          {
            specialization: "Progger",
            name: "John",
          },
          {
            specialization: "Progger",
            name: "Nastya",
          },
        ]
        const pricing2 = {
          Progger: {
            salary: 100000, // without decimal counting system (100.5 or 99.99)
            tax: "5%", // max - 99 min - 0
          },
          Designer: {
            salary: 600,
            tax: "20%",
          },
          ProjectManager: {
            salary: 500,
            tax: "90%",
          },
          ProductManager: {
            salary: 500,
            tax: "40%",
          },
          Tester: {
            salary: 100,
            tax: "10%",
          },
          Driver: {
            salary: 99999,
            tax: "20%",
          },
          Architect: {
            salary: 200,
            tax: "2%",
          },
        }
        const team2 = [
          {
            specialization: "ProjectManager",
            name: "Vasa",
          },
          {
            specialization: "Designer",
            name: "Dima",
          },
          {
            specialization: "Designer",
            name: "Sasha",
          },
          {
            specialization: "Designer",
            name: "Peter",
          },
          {
            specialization: "Architect",
            name: "John",
          },
          {
            specialization: "Driver",
            name: "Nastya",
          },
        ]
        const pricing3 = {
          Progger: {
            salary: 999213, // without decimal counting system (100.5 or 99.99)
            tax: "3%", // max - 99 min - 0
          },
          Designer: {
            salary: 600,
            tax: "20%",
          },
          ProjectManager: {
            salary: 500,
            tax: "90%",
          },
          PductManager: {
            salary: 100000,
            tax: "20%",
          },
        }
        const team3 = [
          {
            specialization: "Progger",
            name: "Vasa",
          },
          {
            specialization: "Designer",
            name: "Vika",
          },
          {
            specialization: "ProjectManager",
            name: "John",
          },
          {
            specialization: "Progger",
            name: "Lena",
          },
        ]
        const pricing4 = {
          Progger: {
            salary: 99990000, // without decimal counting system (100.5 or 99.99)
            tax: "95%", // max - 99 min - 0
          },
          Designer: {
            salary: 600,
            tax: "1%",
          },
          ProjectManager: {
            salary: 73124512,
            tax: "2%",
          },
          ProductManager: {
            salary: 500,
            tax: "26%",
          },
          Tester: {
            salary: 100,
            tax: "21%",
          },
        }
        const team4 = [
          {
            specialization: "Progger",
            name: "Vasa",
          },
          {
            specialization: "Designer",
            name: "Vika",
          },
          {
            specialization: "ProjectManager",
            name: "John",
          },
          {
            specialization: "Tester",
            name: "Dima",
          },
        ]

        expect(window.calculateTeamFinanceReport(pricing1, team1)).toEqual(
            window.correctCalculateTeamFinanceReport(pricing1, team1)
        )
        expect(window.calculateTeamFinanceReport(pricing2, team2)).toEqual(
            window.correctCalculateTeamFinanceReport(pricing2, team2)
        )
        expect(window.calculateTeamFinanceReport(pricing3, team3)).toEqual(
            window.correctCalculateTeamFinanceReport(pricing3, team3)
        )
        expect(
            window.calculateTeamFinanceReport(pricing4, team4)?.totalTaxTesters
        ).toEqual(
            window.correctCalculateTeamFinanceReport(pricing4, team4)?.totalTaxTesters
        )
      })

      console.log("task explanation case")
      it("task explanation case", () => {
        const pricing = {
          Progger: {
            // specialization type 'Progger'
            salary: 1000, // salary minus tax; should be integer; min: 100, max: 100000
            tax: "15%", // tax percent; presented as string with template `{tax}%` where 'tax' is integer;  min: "0%", max: "99%"
          },
          Tester: {
            salary: 1000,
            tax: "10%",
          },
        }

        const team = [
          {
            name: "Masha", // name of team member
            specialization: "Progger", // specialization should be picked from `salaries` otherwise member should be ignored in report
          },
          {
            name: "Vasya",
            specialization: "Tester",
          },
          {
            name: "Taras",
            specialization: "Tester",
          },
        ]

        expect(window.calculateTeamFinanceReport(pricing, team)).toEqual({
          totalBudgetTeam: 3398,
          totalBudgetProgger: 1176,
          totalBudgetTester: 2222,
        })
      })

      console.log("task example case")
      it("task example case", () => {
        const pricing = {
          Manager: { salary: 1000, tax: "10%" },
          Designer: { salary: 600, tax: "30%" },
          Artist: { salary: 1500, tax: "15%" },
        }
        const team = [
          { name: "Misha", specialization: "Manager" },
          { name: "Max", specialization: "Designer" },
          { name: "Vova", specialization: "Designer" },
          { name: "Leo", specialization: "Artist" },
        ]

        expect(window.calculateTeamFinanceReport(pricing, team)).toEqual({
          totalBudgetTeam: 4590,
          totalBudgetManager: 1111,
          totalBudgetDesigner: 1714,
          totalBudgetArtist: 1764,
        })
      })
    })

    prettify.toHTML(run(), document.body)
}

window.intervalId = setInterval(() => {
  if (window.calculateTeamFinanceReport) {
    console.log("interval: " + window.intervalId)
    window.intervalId && clearInterval(window.intervalId)
    console.log("!!!catch!!!")
    console.log("tsTestsRun: " + !!window.tsTestsRun)
    // window.document.querySelector("div.notification").innerHTML = ""
    console.log("tsTestsRun: " + !!window.tsTestsRun)
    window.tsTestsRun && window.tsTestsRun()
  } else {
    console.log("waiting")
    showNotification && showNotification()
    window.showNotification && window.showNotification()
  }
}, 2000)

// prettify.toHTML(run(), document.body)

// The accounting department turned to the IT department with a request to help with the financial report on the work of teams on the side of the vendor. It is known that the teams consist of a different number of specialists in different categories. It is also known that each category of specialists has its own fixed salary minus taxes and the rate of this tax. Accounting needs to calculate the cost of services for each specialty and the entire team.
// Your team leader has prepared a function template that will perform the task. You need to implement this function. See details below
// function calculateTeamFinanceReport(salaries, team) {...}
// where salaries is object with details about salaries and taxes by specialist categories; minimum specializations amount is 1, maximum up to 10;
// see template below
// {
//     Progger: { // specialization type 'Progger'
//         salary: 1000, // salary minus tax; should be integer; min: 100, max: 100000
//         tax: "15%" // tax percent; presented as string with template `{tax}%` where 'tax' is integer;  min: "0%", max: "99%"
//     },
//     Tester: {
//         salary: 1000,
//         tax: "10%"
//     }
//  // any else
// }
// where team is array of objects represented member of team with name and specialization; minimal team size is 1, maximum up to 100;
// see template below
// [
//     {
//         name: "Masha", // name of team member
//         specialization: "Progger" // specialization should be picked from `salaries` otherwise member should be ignored in report
//     },
//     {
//         name: "Vasya",
//         specialization: "Tester"
//     },
//     {
//         name: "Taras",
//         specialization: "Tester"
//     },
//  // any else
// ]
// function should return report object follow next template
// {
//     totalBudgetTeam: 3398, // total salaries with tax of entire team; should be integer (truncate the fractional part)
//     totalBudgetProgger: 1176, // total salaries with tax for all members by 'Progger' specialization; should be integer (truncate the fractional part)
//     totalBudgetTester: 2222, // total salaries with tax for all members by 'Tester' specialization; should be integer (truncate the fractional part)
// }
