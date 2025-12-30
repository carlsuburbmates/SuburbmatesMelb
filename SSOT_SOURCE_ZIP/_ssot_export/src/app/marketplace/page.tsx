export default function Marketplace() {
  return (
    <div>
      <h1>Digital Products Marketplace</h1>
      <p>Browse digital products sold by active vendors.</p>
      {/* Only products from vendors with: 
            - is_vendor = true
            - vendor_status = 'active'
            - published = true
      */}
    </div>
  );
}
