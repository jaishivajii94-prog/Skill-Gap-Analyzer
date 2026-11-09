// Each career lists the skills to assess and a useful starting resource.
const CareerData = [
  {
    id: "frontend", title: "Frontend Developer", symbol: "◧",
    description: "Build the interfaces people use on the web.",
    skills: [
      { id: "html-css", name: "HTML & CSS", target: 4, resource: "https://developer.mozilla.org/en-US/docs/Learn", resourceName: "MDN Learn web development", detail: "Build accessible, well-structured pages and responsive layouts." },
      { id: "javascript", name: "JavaScript", target: 4, resource: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/", resourceName: "freeCodeCamp JavaScript", detail: "Practice the language behind interactive web experiences." },
      { id: "accessibility", name: "Web accessibility", target: 3, resource: "https://web.dev/learn/accessibility/", resourceName: "web.dev accessibility", detail: "Learn to make interfaces usable by more people." },
      { id: "git", name: "Git & GitHub", target: 3, resource: "https://docs.github.com/en/get-started", resourceName: "GitHub getting started", detail: "Track changes and share your code with confidence." },
      { id: "responsive-design", name: "Responsive design", target: 4, resource: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design", resourceName: "MDN responsive design", detail: "Help layouts work well across phones, tablets, and desktops." }
    ]
  },
  {
    id: "python", title: "Python Developer", symbol: "{ }",
    description: "Create useful tools and applications with Python.",
    skills: [
      { id: "python-basics", name: "Python fundamentals", target: 4, resource: "https://docs.python.org/3/tutorial/", resourceName: "Official Python tutorial", detail: "Learn core syntax, functions, and how to structure a program." },
      { id: "python-data", name: "Data structures", target: 3, resource: "https://docs.python.org/3/tutorial/datastructures.html", resourceName: "Python data structures", detail: "Work comfortably with lists, dictionaries, sets, and tuples." },
      { id: "oop", name: "Object-oriented Python", target: 3, resource: "https://docs.python.org/3/tutorial/classes.html", resourceName: "Python classes", detail: "Organize related data and behavior into clear, reusable classes." },
      { id: "apis", name: "Working with APIs", target: 3, resource: "https://www.freecodecamp.org/news/how-to-use-an-api/", resourceName: "freeCodeCamp API guide", detail: "Connect your programs to data and services on the web." },
      { id: "testing", name: "Testing & debugging", target: 3, resource: "https://docs.python.org/3/library/unittest.html", resourceName: "Python unittest", detail: "Find mistakes early and check that your code keeps working." }
    ]
  },
  {
    id: "data", title: "Data Analyst", symbol: "▥",
    description: "Turn data into clear answers and decisions.",
    skills: [
      { id: "sql", name: "SQL", target: 4, resource: "https://www.w3schools.com/sql/", resourceName: "W3Schools SQL tutorial", detail: "Ask useful questions of data stored in relational databases." },
      { id: "data-python", name: "Python for data", target: 3, resource: "https://www.kaggle.com/learn/python", resourceName: "Kaggle Python course", detail: "Use Python to explore and prepare data for analysis." },
      { id: "statistics", name: "Statistics", target: 3, resource: "https://www.khanacademy.org/math/statistics-probability", resourceName: "Khan Academy statistics", detail: "Understand patterns, averages, and uncertainty in data." },
      { id: "visualization", name: "Data visualization", target: 4, resource: "https://www.freecodecamp.org/learn/data-visualization/", resourceName: "freeCodeCamp data visualization", detail: "Choose clear charts that make findings easier to understand." },
      { id: "spreadsheets", name: "Spreadsheets", target: 3, resource: "https://support.microsoft.com/en-us/excel", resourceName: "Microsoft Excel help", detail: "Organize, calculate, and summarize information in tables." }
    ]
  },
  {
    id: "aiml", title: "AI/ML Engineer", symbol: "⌘",
    description: "Explore how data can help software learn.",
    skills: [
      { id: "ml-python", name: "Python programming", target: 4, resource: "https://docs.python.org/3/tutorial/", resourceName: "Official Python tutorial", detail: "Build a strong foundation for experimenting with data and models." },
      { id: "math-ml", name: "Math & statistics", target: 4, resource: "https://www.khanacademy.org/math/statistics-probability", resourceName: "Khan Academy statistics", detail: "Strengthen the math used to reason about data and model results." },
      { id: "numpy", name: "NumPy & data handling", target: 3, resource: "https://numpy.org/learn/", resourceName: "NumPy learning resources", detail: "Work with arrays and prepare data for experiments." },
      { id: "ml-concepts", name: "Machine learning basics", target: 3, resource: "https://developers.google.com/machine-learning/crash-course", resourceName: "Google ML Crash Course", detail: "Get familiar with training, evaluation, and common ML concepts." },
      { id: "ml-visualization", name: "Data visualization", target: 3, resource: "https://www.kaggle.com/learn/data-visualization", resourceName: "Kaggle data visualization", detail: "Inspect patterns and communicate what your data shows." }
    ]
  },
  {
    id: "web", title: "Web Developer", symbol: "⌘",
    description: "Bring websites and web applications to life.",
    skills: [
      { id: "web-html-css", name: "HTML & CSS", target: 4, resource: "https://developer.mozilla.org/en-US/docs/Learn", resourceName: "MDN Learn web development", detail: "Create structured pages and style them for different screens." },
      { id: "web-javascript", name: "JavaScript", target: 4, resource: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/", resourceName: "freeCodeCamp JavaScript", detail: "Add behavior and respond to what people do on your site." },
      { id: "web-backend", name: "Backend fundamentals", target: 3, resource: "https://developer.mozilla.org/en-US/docs/Learn/Server-side", resourceName: "MDN server-side development", detail: "Understand how servers handle requests and return information." },
      { id: "web-apis", name: "APIs & web data", target: 3, resource: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs", resourceName: "MDN web APIs", detail: "Connect a web page to useful data and browser features." },
      { id: "web-git", name: "Git & GitHub", target: 3, resource: "https://docs.github.com/en/get-started", resourceName: "GitHub getting started", detail: "Keep a history of changes and collaborate on projects." }
    ]
  }
];