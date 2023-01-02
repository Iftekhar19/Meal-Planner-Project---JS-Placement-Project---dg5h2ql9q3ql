const height=document.querySelector("#height");
const weight=document.querySelector("#weight");
const age=document.querySelector("#age");
const gender=document.querySelector("#gender");
const activity=document.querySelector("#activity__level");
const form=document.querySelector("#form");
const submit_btn=document.querySelector("#submit-btn");
const card__holder=document.querySelector("#meals__container");
const recipie__container=document.querySelector("#recipie__container");
const lunch_img_url="https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGx1bmNoJTIwZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
const breakFast_img_url="https://media.istockphoto.com/id/1181240435/photo/grilled-chicken-salad.jpg?b=1&s=170667a&w=0&k=20&c=yP6CiMb5dZkx55g5z5OLVwidSl_WvmWdZK0HkqInPlA=";
const dinner_img_url="https://media.istockphoto.com/id/836012728/photo/holiday-turkey-dinner.jpg?b=1&s=170667a&w=0&k=20&c=N4uTL0EJIgQGVzJbb4XYmgzeL-YLYFE_0WUOVS6eNO0=";
const img_links=[breakFast_img_url,lunch_img_url,dinner_img_url];
// submit Handler for form
form.addEventListener("submit", async(e)=>
{
    e.preventDefault();
    if(isNaN(weight.value.trim()))
    {
      alert("please enter the weight properly");
      weight.focus();
      return;  
    }
    else if(isNaN(height.value.trim()))
    {
        alert("please enter the height properly");
        height.focus();
      return;
    }
    else if(isNaN(age.value.trim()))
    {
        alert("please enter the age properly");
        age.focus();
      return;
    }
    if(gender.value !=="" && activity.value!=="")
    {
        card__holder.innerHTML=`<div id="loader"></div>`
      const data=BMR(gender.value,height.value,weight.value,age.value);
      const calories=data * (+activity.value);
    //   console.log(calories)
    let temp=await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=0417da33dca944c6ba2beee2a9b90e24&timeFrame=day&targetCalories=${calories}`);
     let mealData=await temp.json();
     console.log(mealData);
     generate_meals_card(mealData)
    }
    else
    { 
      alert("please selct gender/activity level properly") ; 
    }
    weight.value="";
    height.value="";
    age.value="";
    gender.selectedIndex=0;
    activity.selectedIndex=0;
})
// generating melas card
function generate_meals_card(mealData)
{
  recipie__container.innerHTML="";  
  const {calories } =mealData.nutrients;
  const {meals:mealsArray}=mealData;
  card__holder.innerHTML="";
  ["breakfast","lunch","dinner"].map((e,ind)=>
  {
    const str=`
    <section class="card">
                 <span class="header">${e}</span>
                 <img src="${img_links[ind]}" alt="image for BREAKFAST">
                 <div class="card__action">
                    <h2>Meal ${ind+1}</h2>
                    <span>Calories - ${calories.toFixed(0)}</span>
                    <button onclick="getRecipe(${mealsArray[ind].id})">GET RECIPE</button>
                 </div>   
                </section>`;
   card__holder.appendChild(convertHTML(str));
  });

}
// function for converting to dom
function convertHTML(str)
{
   const div=document.createElement("div");
   div.innerHTML=str;
   return div.children[0];
}
// calculating BMR function 
function BMR(gender,height,weight,age)
{
    switch(gender)
    {
        case "male":
            return 66.47 + (13.75 * +weight) + (5.003 * +height) - (6.755 * +age); 
        case "female":
            return   655.1 + (9.563 * +weight) + (1.850 * +height) - (4.676 * +age );
        default :
           alert("please Select the gender properly");
           break;    
    }
}

// function for fetch recipie

async function getRecipe(id)
{
    console.log(id)
  const recipie= await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=0417da33dca944c6ba2beee2a9b90e24&includeNutrition=false`)
  const recipes=await recipie.json();
  
  const {extendedIngredients:ingridients}=recipes;
  console.log(ingridients)
  const str=`<table class="recipie_table">
  <thead>
    <tr>
      <th>ingredients</th>
      <th>steps</th>
      <th>quantities</th>
    </tr>
  </thead>
  
</table>
  `;
  let fragments=document.createDocumentFragment();
  fragments.appendChild(convertHTML(str));
//   console.log(fragments)
  recipie__container.innerHTML="";
  recipie__container.appendChild(createTable(fragments.children[0],ingridients))
 recipie__container.scrollIntoView({
    behavior:"smooth"
 })
}
// create table function
function createTable(table,arr)
{
    let tbody=document.createElement("tbody");
console.log(tbody)
 arr.forEach((e)=>
 {
//     let str=`<tr><td>${e.name}</td><td>Null</td><td>${e.measures.metric.amount}${e.measures.metric.unitShort}</td></tr>`;
//     let temp=convertHTML(str)
//        console.log(temp)
//    tbody.appendChild(temp);
         let tr=document.createElement("tr");
         let td1=document.createElement("td");
         td1.innerText=e.name;
         tr.appendChild(td1);
         let td2=document.createElement("td");
         tr.appendChild(td2)
         let td3=document.createElement("td");
         td3.innerText=e.measures.metric.amount+e.unit|| e.measures.metric.unitLong;
         tr.appendChild(td3);
         tbody.appendChild(tr);
 });
 table.appendChild(tbody);
 return table;
}