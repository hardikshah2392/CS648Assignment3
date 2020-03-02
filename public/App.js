function ProdRow(props) {
  const product = props.product;
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      null,
      product.Name
    ),
    React.createElement(
      "td",
      null,
      "$".concat(product.Price)
    ),
    React.createElement(
      "td",
      null,
      product.Category
    ),
    React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: product.Image, target: "_blank" },
        "View"
      )
    )
  );
}

function ProdTable(props) {
  const ProdRows = props.products.map(product => React.createElement(ProdRow, { key: product.id, product: product }));
  return React.createElement(
    "table",
    { className: "bordered-table" },
    React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "Product Name"
        ),
        React.createElement(
          "th",
          null,
          "Price"
        ),
        React.createElement(
          "th",
          null,
          "Category"
        ),
        React.createElement(
          "th",
          null,
          "Image"
        )
      )
    ),
    React.createElement(
      "tbody",
      null,
      ProdRows
    )
  );
}

class ProdAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.ProdAdd;
    var price = form.Price.value;
    var newPrice = price.substr(1, price.length);
    const product = {
      Category: form.Category.value, Price: newPrice,
      Name: form.Name.value, Image: document.getElementById("image").value
    };
    this.props.createProduct(product);
    form.Category.value = "Shirts";
    form.Price.value = "$";
    form.Name.value = "";
    form.Image.value = "";
  }
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement("br", null),
      React.createElement(
        "h2",
        null,
        "Add Product"
      ),
      React.createElement(
        "form",
        { name: "ProdAdd", onSubmit: this.handleSubmit },
        React.createElement(
          "label",
          null,
          "Category"
        ),
        React.createElement(
          "label",
          null,
          "Name"
        ),
        React.createElement(
          "select",
          { name: "Category" },
          React.createElement(
            "option",
            { value: "Shirts" },
            "Shirts"
          ),
          React.createElement(
            "option",
            { value: "Jeans" },
            "Jeans"
          ),
          React.createElement(
            "option",
            { value: "Jackets" },
            "Jackets"
          ),
          React.createElement(
            "option",
            { value: "Sweaters" },
            "Sweaters"
          ),
          React.createElement(
            "option",
            { value: "Accessories" },
            "Accessories"
          )
        ),
        React.createElement("input", { type: "text", name: "Name" }),
        React.createElement(
          "label",
          null,
          "Price"
        ),
        React.createElement(
          "label",
          null,
          "Image"
        ),
        React.createElement("input", { type: "text", name: "Price" }),
        React.createElement("input", { type: "text", name: "Image", id: "image" }),
        React.createElement(
          "button",
          null,
          "Add"
        )
      )
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.list();
    this.createProduct = this.createProduct.bind(this);
  }
  componentDidMount() {
    this.list();
    document.forms.ProdAdd.Price.value = "$";
  }
  async createProduct(product) {
    const query = `mutation {
      addProduct(product: {
        Category: ${product.Category},
        Name: "${product.Name}",
        Price:${product.Price},
        Image:"${product.Image}",
      }) {
        id
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    this.list();
  }

  async list() {
    const query = `query {
      productList {
        id Category Name Price
        Image
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }
  render() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "h1",
        null,
        "My Company Inventory"
      ),
      React.createElement(
        "div",
        null,
        "Showing all available products"
      ),
      React.createElement("hr", null),
      React.createElement(ProdTable, { products: this.state.products }),
      React.createElement("hr", null),
      React.createElement(ProdAdd, { createProduct: this.createProduct })
    );
  }
}
const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('content'));