console.log("Hello")

// ...existing code...

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// ...existing code...

let blogData = []

// Fetch the JSON file
async function fetchBlogData(){
    const response = await fetch('mynachiketa_blogs_metadata.json');
    const data = await response.json();
    blogData = data;
    populateDropdown();

}

fetchBlogData();

function populateDropdown(){
    const selector = document.getElementById('blog-selector')
    blogData.forEach((blog, index) =>{
        const opt = document.createElement('option');
        opt.value = index ;
        opt.textContent = blog.title;
        selector.appendChild(opt);
    })
}

document.getElementById('blog-selector').addEventListener('change', function (event){
    const index = event.target.value ;
    if (index!== ""){
        const selectedBlog = blogData[index];
        console.log("Selected Blog: ", selectedBlog);
    }
})

// RECOMMEND BUTTON LOGIC
async function recommendBlogs(){
    console.log("recommendBlog function called")
    const selector = document.getElementById('blog-selector');
    
    const index = selector.value;
    if (index=== ""){
        return alert("Please select a blog!");
    }

    const blog = blogData[index];

    console.log(`Blog = ${blog.title}`)
    const payload = {
        title: blog.title,
        language: blog.language || "English",
        category: blog.category || "General",  // only category has null values
        author:  blog.author || "myNachiketa",
        read_time: blog["read_time(mins)"].toString()
    };

    const response = await fetch("https://blogs-books-recommend.onrender.com/recommendBlogs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json()
    console.log(`Showing first data received \ndata.results[0]`)
    showBlogResults(data.results);

}

async function recommendBooks(){

    console.log("recommendBooks() function is called")

    const selector = document.getElementById('blog-selector');
    const index = selector.value;
    if (index=== ""){
        return alert("Please select a blog!");
    }

    const blog = blogData[index]

    console.log(`Blog = ${blog.title}`)
    const payload = {
        title: blog.title,
        language: blog.language || "English",
        category: blog.category || "General",
        author: blog.author || "myNachiketa"
    }

    const response = await fetch("https://blogs-books-recommend.onrender.com/recommendBooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json()

    console.log(`Data first card = {data.results[0]} `)

    showBookResults(data.results)

}


// Display results as cards
// ...existing code...

function showBlogResults(results){

    console.log("Showing results for recommended blogs...")


    const container = document.getElementById('results');
    container.innerHTML = ""; // clear previous results

    results.forEach(blog => {
        const card = document.createElement('div');
        card.className = "bg-gradient-to-br from-yellow-100 to-blue-100 p-5 rounded-2xl shadow-lg border border-yellow-300 transition-transform hover:scale-105 hover:shadow-2xl";

        card.innerHTML = `
            <h3 class="text-xl font-bold text-yellow-800 mb-2">${blog.title}</h3>
            <div class="flex flex-wrap gap-2 mb-2">
                <span class="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs">Language: ${blog.language}</span>
                <span class="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs">Author: ${blog.author}</span>
                <span class="bg-green-200 text-green-900 px-2 py-1 rounded text-xs">Category: ${blog.category}</span>
                <span class="bg-pink-200 text-pink-900 px-2 py-1 rounded text-xs">Read Time: ${blog["read_time(mins)"]} mins</span>
            </div>
            <a href="${blog.url}" target="_blank" class="inline-block mt-2 px-4 py-2 bg-yellow-400 text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition">Read Blog</a>
        `;

        container.appendChild(card);
    });
}

function showBookResults(results){

    console.log("Showing results for recommended books...")

    const container = document.getElementById('results');
    container.innerHTML = ""; // clear previous results

    results.forEach(book => {
        const card = document.createElement('div');
        card.className = "bg-gradient-to-br from-green-100 to-blue-100 p-5 rounded-2xl shadow-lg border border-green-300 transition-transform hover:scale-105 hover:shadow-2xl";

        if (!book.type){  // if book.type is empty 
            book.type = "General";
        }

        card.innerHTML = `
            <h3 class="text-xl font-bold text-green-800 mb-2">${book.Title}</h3>
            <div class="flex flex-wrap gap-2 mb-2">
                <span class="bg-green-200 text-green-900 px-2 py-1 rounded text-xs">Language: ${book.language}</span>
                <span class="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs">Category: ${book.Category}</span>
                <span class="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs">Type: ${book.type}</span>
            </div>
            <a href="${book.url}" target="_blank" class="inline-block mt-2 px-4 py-2 bg-green-400 text-white rounded-lg font-semibold shadow hover:bg-green-500 transition">Know More</a>
        `;

        container.appendChild(card);
    });
}

// ...existing code...

// function showBlogResults(results){
//     const container = document.getElementById('results');
//     container.innerHTML = ""; // clear previous results

//     results.forEach(blog => {
//         const card = document.createElement('div')
//         card.className = "bg-white p-4 rounded-lg shadow";

//         card.innerHTML = `
//             <h3 class="text-xl font-semibold">${blog.title}</h3>
//             <p class = "text-sm text-gray-600">Language: ${blog.language}</p>
//             <p class = "text-sm text-gray-600">Author: ${blog.author}</p>
//             <p class = "text-sm text-gray-600">Category: ${blog.category}</p>
//             <p class = "text-sm text-gray-600">Read Time: ${blog["read_time(mins)"]} mins</p>
//             <a href="${blog.url}" target="_blank" class = "text-blue-600 underline mt-2 inline-block">Read Blog</a>
//         `;

//         container.appendChild(card);
//     }
//     )

// }


// // Display results as cards
// function showBookResults(results){
//     const container = document.getElementById('results');
//     container.innerHTML = ""; // clear previous results

//     results.forEach(book => {
//         const card = document.createElement('div')
//         card.className = "bg-white p-4 rounded-lg shadow";

//         if (!book.type){  // if book.type is empty 
//             book.type = "General";
//         }

//         card.innerHTML = `
//             <h3 class="text-xl font-semibold">${book.Title}</h3>
//             <p class = "text-sm text-gray-600">Language: ${book.language}</p>
//             <p class = "text-sm text-gray-600">Category: ${book.Category}</p>
//             <p class = "text-sm text-gray-600">Type: ${book.type}</p>
//             <a href="${book.url}" target="_blank" class = "text-blue-600 underline mt-2 inline-block">Know More</a>
//         `;

//         container.appendChild(card);
//     }
//     )

// }