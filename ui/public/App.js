/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "no-alert": "off" */
function ProductRow({
  product
}) {
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.name), /*#__PURE__*/React.createElement("td", null, product.price), /*#__PURE__*/React.createElement("td", null, product.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.image,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Veiw")));
}

function ProductTable({
  products
}) {
  const productRows = products.map(product => /*#__PURE__*/React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Product Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productRows));
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
      image: form.imageURL.value
    };
    const {
      createProduct
    } = this.props;
    createProduct(product);
    form.productName.value = '';
    form.price.value = '$';
    form.category.selectedIndex = 0;
    form.imageURL.value = '';
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
      className: "flex-container",
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "category"
    }, "Category", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      id: "category",
      name: "category"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), /*#__PURE__*/React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), /*#__PURE__*/React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), /*#__PURE__*/React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), /*#__PURE__*/React.createElement("option", {
      value: "Accessories"
    }, "Accessories")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "price"
    }, "Price Per Unit", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "price",
      name: "price",
      defaultValue: "$"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "productName"
    }, "Product Name", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "productName",
      name: "productName"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "imageURL"
    }, "Image URL", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "imageURL",
      name: "imageURL",
      placeholder: "URL"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add Product"))));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(newProduct) {
    const query = `mutation productAdd($newProduct: ProductInputs!) {
      productAdd(product: $newProduct) {
        id
      }
    }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          newProduct
        }
      })
    });

    if (response) {
      this.loadData();
    }
  }

  render() {
    const {
      products
    } = this.state;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "My Company Inventory"), /*#__PURE__*/React.createElement("h2", null, "Showing all available products"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductTable, {
      products: products
    }), /*#__PURE__*/React.createElement("h2", null, "Add a new product to inventory"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(ProductList, null), document.getElementById('inventory'));