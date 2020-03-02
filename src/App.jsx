function ProdRow(props) {
  const product = props.product;
  return(
    <tr>
      <td>{product.Name}</td>
      <td>{("$").concat(product.Price)}</td>
      <td>{product.Category}</td>
      <td><a href={product.Image} target="_blank">View</a></td>
    </tr>
  );
}

function ProdTable(props) {
  const ProdRows = props.products.map(
    product => <ProdRow key={product.id} product={product}/>);
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
      <tbody>
        {ProdRows}
      </tbody>
    </table>
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
      Category:form.Category.value, Price: newPrice, 
      Name: form.Name.value, Image:document.getElementById("image").value
    };
    this.props.createProduct(product);
    form.Category.value="Shirts";
    form.Price.value="$";
    form.Name.value="";
    form.Image.value="";
  }
  render() {
    return(
      <div>
        <br/>
        <h2>Add Product</h2>
      <form name= "ProdAdd" onSubmit={this.handleSubmit}>
      <label>Category</label>
      <label>Name</label>
      <select name="Category">
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
      </select>
      <input type="text" name="Name"/>
      <label>Price</label>
      <label>Image</label>
      <input type="text" name="Price"/>
      <input type="text" name="Image" id="image"/>
      <button>Add</button>
    </form>
  </div>
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {products:[]};
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
      headers: { 'Content-Type': 'application/json'},
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
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }
  render() {
    return(
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <div>Showing all available products</div>
        <hr/>
        <ProdTable products={this.state.products}/>
        <hr/>
        <ProdAdd createProduct={this.createProduct}/>
      </React.Fragment>
    );
  }
}
const element = <ProductList/>
ReactDOM.render(element, document.getElementById('content'));