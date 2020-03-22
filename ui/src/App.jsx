function ProductRow({ product }) {
  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.price}</td>
      <td>{product.category}</td>
      <td><a href={product.image} target="_blank" rel="noopener noreferrer">Veiw</a></td>
    </tr>
  );
}

function ProductTable({ products }) {
  const productRows = products.map(product => <ProductRow key={product.id} product={product} />);
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
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const price = form.price.value.replace('$', '');
    const product = {
      name: form.productName.value,
      price: price > 0 ? price : 0,
      category: form.category.value,
      image: form.imageURL.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    form.productName.value = '';
    form.price.value = '$';
    form.category.selectedIndex = 0;
    form.imageURL.value = '';
  }

  render() {
    return (
      <div>
        <form className="flex-container" name="productAdd" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="category">
              Category
              <br />
              <select id="category" name="category">
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="price">
              Price Per Unit
              <br />
              <input type="text" id="price" name="price" defaultValue="$" />
            </label>
          </div>
          <div>
            <label htmlFor="productName">
              Product Name
              <br />
              <input type="text" id="productName" name="productName" />
            </label>
          </div>
          <div>
            <label htmlFor="imageURL">
              Image URL
              <br />
              <input type="text" id="imageURL" name="imageURL" placeholder="URL" />
            </label>
          </div>
          <div>
            <button type="submit">Add Product</button>
          </div>
        </form>
      </div>
    );
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { newProduct } }),
    });
    if (response) {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products</h2>
        <hr />
        <ProductTable products={products} />
        <h2>Add a new product to inventory</h2>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}

ReactDOM.render(<ProductList />, document.getElementById('inventory'));
