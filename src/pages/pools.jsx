import { Helmet } from 'react-helmet-async';

import { PoolsTable } from 'src/sections/nomination-pools';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Nomination Pools </title>
      </Helmet>

      <PoolsTable />
    </>
  );
}
