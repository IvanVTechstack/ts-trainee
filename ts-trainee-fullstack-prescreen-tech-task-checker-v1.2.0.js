const {
  core: { describe, it, expect, run },
  enzyme: { mount },
  prettify,
} = window.jestLite

console.log("srat load Task checker")
window.showNotification = (notificationText, textColor = 'white') => {
  let notificationNode = window.document.querySelector("div.notification")
  if (!notificationNode) {
    notificationNode = document.createElement("div")
    notificationNode.classList.add("notification")
    document.body.append(notificationNode)
  }

  notificationNode.innerHTML = notificationText || ""
  notificationNode.style.color = textColor
}

window.showCheckResult = () => {
    const baseSelector = "span.jest-lite-report__summary-status"
    let resultNode = window.document.body.querySelector(baseSelector + "--fail")
    if (resultNode) {
      console.log("==check result: " + resultNode.innerText)
      const regexRes = resultNode.innerText.match(/(\d?) passed/)
      if (regexRes[1]) {
        const passedTestsCount = parseInt(regexRes[1])
        if (passedTestsCount > 0) {
          console.log("==check PASSED PARTIALLY")
          window.showNotification("PASSED PARTIALLY", "yellow")
        } else {
          console.log("==check FAILED")
          window.showNotification("FAILED", "red")
        }
      }
    } else if (window.document.body.querySelector(baseSelector + "--pass")) {
      console.log("==check PASSED")
      window.showNotification("PASSED", "green")
    }
  }

/**********************************************
    Tests
  ***********************************************/
window.tsTestsRun = () => {
  console.log("run 'calculateTeamFinanceReport' tests")
  describe("'calculateTeamFinanceReport' function", () => {
    it("should pass Dima's test #1 (rounding trap)", () => {
      console.log("run Dima's test #1 (rounding trap")
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
        {totalBudgetProgger: 800000, totalBudgetTeam: 800000}
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
        {"totalBudgetArchitect": 204, "totalBudgetDesigner": 2250, "totalBudgetDriver": 124998, "totalBudgetProjectManager": 5000, "totalBudgetTeam": 132452}
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
       {"totalBudgetDesigner": 750, "totalBudgetProgger": 2060232, "totalBudgetProjectManager": 5000, "totalBudgetTeam": 2065982}
      )
    })

    it("should pass Dima's test #4 (tricky rounding case with big values)", () => {
      console.log("run Dima's test #4 (tricky rounding case with big values)")
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
        {"totalBudgetDesigner": 606, "totalBudgetProgger": 1999800000, "totalBudgetProjectManager": 74616848, "totalBudgetTeam": 2074417581, "totalBudgetTester": 126}
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
    
    it("should pass 100 members team with minimal salary and tax", () => {
      console.log("run 100 members team with minimal salary and ta")
      const salaries = {
        Progger: {
          salary: 1,
          tax: "1%",
        }
      }

      const team = []
      for (let i = 1; i <= 100; i++) {
        team.push({ name: "dev" + i, specialization: "Progger" })
      }

      expect(window.calculateTeamFinanceReport(salaries, team)).toEqual(
        {"totalBudgetProgger": 101, "totalBudgetTeam": 101}
      )
    })

    it("should pass 100 members team with maximum salary and tax", () => {
      console.log("run 100 members team with maximum salary and ta")
      const salaries = {
        Progger: {
          salary: 100000,
          tax: "99%",
        }
      }

      const team = []
      for (let i = 1; i <= 100; i++) {
        team.push({ name: "dev" + i, specialization: "Progger" })
      }

      expect(window.calculateTeamFinanceReport(salaries, team)).toEqual(
        {"totalBudgetProgger": 1000000000, "totalBudgetTeam": 1000000000}
      )
    })
    
    it("should pass case with empty input ", () => {
        console.log("run case with empty input")
        const salaries = {}
        const team = []
        

        expect(window.calculateTeamFinanceReport(salaries, team)).toEqual({
            totalBudgetTeam: 0
        })
    })

    it("should pass zero tax case", () => {
        console.log("run zero tax case")
        const salaries = {
            TeamLead: { salary: 333, tax: "0%" },
            Architect: { salary: 666, tax: "0%" },
        }
        const team = [
            { name: "Alex", specialization: "TeamLead" },
            { name: "Niko", specialization: "Architect" },
        ]

        expect(window.calculateTeamFinanceReport(salaries, team)).toEqual({
            totalBudgetTeam: 999,
            totalBudgetArchitect: 666,
            totalBudgetTeamLead: 333,
        })
    })
  })

  prettify.toHTML(run(), document.body)
  window.showNotification("...checking...")
  setTimeout(window.showCheckResult, 200)
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
