// Product

const { checkout } = require("../routes/shopRoutes")
const Category = require("./Category")

// {
//         "name": "banana1",
//         "weight": "500 gm",
//         "category": "fruits",
//         "price": 50,
//         "oldPrice": 5,
//         "img":"img-2.png",
//          "qty": 6,
//         "stock": 3
// }

   // Category
   
// {
//         "name": "banana6",
      
//         "img":"img-2.png"
        
// }

// cart
// {
//   "userId": "nakum12@gmail.com",
//   "items": [
//     {
//       "productId": "670c",
//       "name": "Tomato",
//       "price": 30,
//       "qty": 2,
//       "img": "tomato.png"
//     }
//   ]
// }


// checkout
// {
//   "cartItems": [
//     {
//       "productId": "6989bb25af3773e011aeff3b",
//       "name": "Potatoes",
//       "price": 30,
//       "qty": 4,
//       "img": "data:image/jpeg;base64,..."
//     }
//   ],
//   "customerDetails": {
//     "fullName": "abc",
//     "email": "abc@gmail.com",
//     "address": "junagna",
//     "city": "jamnagar",
//     "state": "gujarat",
//     "pinCode": "361007",
//     "phone": "55565656",
//     "paymentMode": "COD"
//   },
//   "totalAmount": 570
// }