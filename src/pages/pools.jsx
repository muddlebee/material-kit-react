import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';

function PoolsTable() {
  const [poolsData, setPoolsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('pool_id'); 
  const [orderDirection, setOrderDirection] = useState('asc'); 
  const [selectedPools, setSelectedPools] = useState([]);

  useEffect(() => {
    const fetchPools = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('https://westend.api.subscan.io/api/scan/nomination_pool/pools', {
          state: "Open"
        }, {
          headers: {
            'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
            'Content-Type': 'application/json',
            'Accept':'/',
            'Host': 'westend.api.subscan.io',
            'Connection': 'keep-alive'
          }
        });
        setPoolsData(response.data.data.list); // Store 'list' within the response
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchPools();
  }, []);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  

  const handleRowSelection = (rowId) => {
    const selectedIndex = selectedPools.indexOf(rowId);
    let newSelectedPools = [];

    if (selectedIndex === -1) {
      newSelectedPools = newSelectedPools.concat(selectedPools, rowId);
    } else if (selectedIndex === 0) {
      newSelectedPools = newSelectedPools.concat(selectedPools.slice(1));
    } else if (selectedIndex === selectedPools.length - 1) {
      newSelectedPools = newSelectedPools.concat(selectedPools.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedPools = newSelectedPools.concat(
        selectedPools.slice(0, selectedIndex),
        selectedPools.slice(selectedIndex + 1)
      );
    }

    setSelectedPools(newSelectedPools);
  };

  const sortedData = [...poolsData].sort((a, b) => {
    let comparison = 0;
  
    if (orderBy === 'pool_id' || orderBy === 'total_bonded') {
      // Compare based on BigInts for accurate handling of very large numbers as strings 
      const aValue = BigInt(a[orderBy]);
      const bValue = BigInt(b[orderBy]);
  
      // eslint-disable-next-line no-nested-ternary
      comparison = aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
    } else {
      // ... Existing string comparison logic
    }
  
    return orderDirection === 'asc' ? comparison : -comparison;
  });
  

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" /> {/* Column for selection */}
            <TableCell sortDirection={orderBy === 'pool_id' ? orderDirection : false}>
              <TableSortLabel 
                active={orderBy === 'pool_id'}
                direction={orderBy === 'pool_id' ? orderDirection : 'asc'}
                onClick={() => handleSortRequest('pool_id')}
              >
                Pool ID
              </TableSortLabel>
            </TableCell>
            <TableCell>Pool Name</TableCell> 
            <TableCell>
              <TableSortLabel
                active={orderBy === 'total_bonded'}
                direction={orderBy === 'total_bonded' ? orderDirection : 'asc'}
                onClick={() => handleSortRequest('total_bonded')}
              >
                Total Bonded
              </TableSortLabel>
            </TableCell>
            {/* Add more column headers based on your API data */}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell> {/* Adjust colSpan */}
              </TableRow>
          ) : (
            sortedData.map((pool) => (
              <TableRow 
                key={pool.pool_id} 
                selected={selectedPools.includes(pool.pool_id)} 
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selectedPools.includes(pool.pool_id)}
                    onChange={(event) => handleRowSelection(pool.pool_id)}
                  />
                </TableCell>
                <TableCell>{pool.pool_id}</TableCell>
                <TableCell>{pool.metadata}</TableCell> {/* Assuming 'metadata' for name */}
                <TableCell>{pool.total_bonded}</TableCell>
                {/* Add more cells based on your API data */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PoolsTable;
