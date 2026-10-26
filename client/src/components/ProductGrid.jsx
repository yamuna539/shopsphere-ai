import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No products found</h4>

        <p className="text-muted">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        <div
          className="col-12 col-sm-6 col-lg-4 col-xl-3"
          key={product._id}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;