const goods = [
    { img: 'item_1', title: 'Shirt', price: 150 },
    { img: 'item_2', title: 'Socks', price: 50 },
    { img: 'item_3', title: 'Jacket', price: 350 },
    { img: 'item_4', title: 'Shoes', price: 250 },
];


const $goodsList = document.querySelector('.goods-list');
  
const renderGoodsItem = ({ img, title, price }) => {
    return `<div class="goods-item"><img src="images/${img}.png" alt="${img}"><h3>${title}</h3><p>$${price}</p></div>`;
};
  
const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
            item => renderGoodsItem(item)
        ).join('');

    $goodsList.insertAdjacentHTML('beforeend', goodsList);
}
  
renderGoodsList();