fetch('http://localhost:3000').then(res => res.text()).then(html => console.log(html.includes("RepoPulse 3D")))
