var contentNode = document.getElementById('inventory');

class ProductTable extends React.Component {
  render() {
    const productRows = this.props.products.map(product => <ProductRow key={product.id} product={product} />)
    return (
      <table className="bordered-table">
       <thead>
         <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>{productRows}</tbody>
      </table>
    )
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <tr>
       <td>{product.name}</td>
       <td>${product.price}</td>
       <td>{product.category}</td>
       <td><a href={product.image} target="_blank">Veiw</a></td>
     </tr>
    )
  }
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.productAdd;
    var price = form.price.value.replace('$','');
    this.props.createProduct({
      name: form.productName.value,
      price: price>0?price:0,
      category: form.category.value,
      image: form.imageURL.value
    });
    form.productName.value = "";
    form.price.value = "$";
    form.category.selectedIndex = 0;
    form.imageURL.value = "";
  }
  render() {
    return (
      <div>
      <form className="flex-container" name="productAdd" onSubmit={this.handleSubmit}>
      <div>
       <label>Category</label><br/>
       <select name="category" >
         <option value="Shirts">Shirts</option>
         <option value="Jeans">Jeans</option>
         <option value="Jackets">Jackets</option>
         <option value="Sweaters">Sweaters</option>
         <option value="Accessories">Accessories</option>
       </select>
       </div>
       <div>
       <label>Price Per Unit </label> <br/>
       <input type="text" name="price" defaultValue="$"/>
       </div>
       <div>
       <label> Product Name</label><br/>
       <input type="text" name="productName" placeholder="Product Name"/>
       </div>
       <div>
       <label>Image URL</label><br/>
       <input type="text" name="imageURL"  placeholder="URL"/>
       </div>
       <div>
       <button type="submit">Add Product</button>
       </div>
      </form>
      </div>
    )
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id category name price image
      }
    }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async createProduct(newProduct) {
    const query = `mutation productAdd($newProduct: ProductInputs!) {
      productAdd(product: $newProduct) {
        id
      }
    }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables: { newProduct } })
    });
    this.loadData();
  }

  render() {
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products</h2>
        <hr/>
        <ProductTable products={this.state.products}/>
        <h2>Add a new product to inventory</h2>
        <hr/>
        <ProductAdd createProduct={this.createProduct}/>
      </div>
    );
  }
}
ReactDOM.render(<ProductList/>, contentNode);
