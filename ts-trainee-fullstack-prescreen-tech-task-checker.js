const {
  core: { describe, it, expect, run },
  enzyme: { mount },
  prettify,
} = window.jestLite

console.log("srat load Task checker")
window.showNotification = (notificationText) => {
  let notificationNode = window.document.querySelector("div.notification")
  if (!notificationNode) {
    notificationNode = document.createElement("div")
    notificationNode.classList.add("notification")
    document.body.append(notificationNode)
  }

  notificationNode.innerHTML = notificationText || ""
}

/**********************************************
    calculateTeamFinanceReportExpected
  ***********************************************/

window.calculateTeamFinanceReportExpected = (salaries, team) => {
  const result = {
    totalBudgetTeam: 0,
  }

  for (const member of team) {
    const specialization = salaries[member.specialization]
    if (!specialization) {
      continue
    }

    const cleanSalaryPercent = 100 - Number.parseInt(specialization.tax)
    const cleanSalary = specialization.salary / (cleanSalaryPercent / 100)
    const budgetKey = `totalBudget${member.specialization}`
    if (!result[budgetKey]) {
      result[budgetKey] = 0
    }

    result.totalBudgetTeam += cleanSalary
    result[budgetKey] += cleanSalary
  }

  Object.entries(result).forEach(([key, val]) => {
    result[key] = Math.trunc(val)
  })

  return result
}
/**********************************************
    calculateTeamFinanceReportExpected
  ***********************************************/

/**********************************************
    Tests
  ***********************************************/
window.tsTestsRun = () => {
  console.log("run 'calculateTeamFinanceReport' tests")
  describe("'calculateTeamFinanceReport' function", () => {
    it("should pass Dima's test #1", () => {
      console.log("run Dima's test #1")
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
      expect(window.calculateTeamFinanceReport(pricing1, team1)).toEqual(
        window.calculateTeamFinanceReportExpected(pricing1, team1)
      )
    })

    it("should pass Dima's test #2", () => {
      console.log("run Dima's test #2")
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
      expect(window.calculateTeamFinanceReport(pricing2, team2)).toEqual(
        window.calculateTeamFinanceReportExpected(pricing2, team2)
      )
    })

    it("should pass Dima's test #3", () => {
      console.log("run Dima's test #3")
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

      expect(window.calculateTeamFinanceReport(pricing3, team3)).toEqual(
        window.calculateTeamFinanceReportExpected(pricing3, team3)
      )
    })

    it("should pass Dima's test #4 (tricky rounding case)", () => {
      console.log("run Dima's test #4 (tricky rounding case)")
      const salaries = {
        Progger: {
          salary: 99990000,
          tax: "95%",
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
      const team = [
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
        {
          specialization: "General",
          name: "Napoleon",
        },
      ]

      expect(window.calculateTeamFinanceReport(salaries, team)).toEqual(
        window.calculateTeamFinanceReportExpected(salaries, team)
      )
    })

    it("should pass task explanation case", () => {
      console.log("run task explanation case")
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

    it("should pass task example case #1", () => {
      console.log("run task example case #1")
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

    it("should pass task example case #2", () => {
      console.log("run task example case #2")
      const salaries = {
        TeamLead: { salary: 10000, tax: "1%" },
        Architect: { salary: 90000, tax: "34%" },
      }
      const team = [
        { name: "Alexander", specialization: "TeamLead" },
        { name: "Gaudi", specialization: "Architect" },
        { name: "Koolhas", specialization: "Architect" },
        { name: "Foster", specialization: "Architect" },
        { name: "Napoleon", specialization: "General" },
      ]

      expect(window.calculateTeamFinanceReport(salaries, team)).toEqual(
        window.calculateTeamFinanceReportExpected(salaries, team)
      )
    })    
  })

  prettify.toHTML(run(), document.body)
}
/**********************************************
    Tests
  ***********************************************/

window.runTaskCheckerWaitingSeconds = 0
window.runTaskChecker = () => {
  window.runTaskCheckerWaitingSeconds++
  if (window.calculateTeamFinanceReport) {
    window.intervalId && clearInterval(window.intervalId)
    console.log("FOUND tested function")
    window.showNotification("checking in progress...")
    window.tsTestsRun()
    window.showNotification("")
  } else {
    console.log(
      "waiting tested function " + window.runTaskCheckerWaitingSeconds + " sec"
    )
    window.showNotification("Please, put candidate's code in JS section")
  }
}

console.log("start waiting input tested function")
window.runTaskChecker()
window.intervalId = setInterval(window.runTaskChecker, 1000)
console.log("end load Task checker")

// ********** TASK **********
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
