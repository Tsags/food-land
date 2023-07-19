import React from "react";
import { TableContainer, Table, Td, Th, Tbody, Tr, Thead, ListItem, UnorderedList } from "@chakra-ui/react";

const CompletedOrdersTab = ({ completedOrders }) => {
  return (
    <>
      {completedOrders && (
        <TableContainer minHeight="108vh">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Table</Th>
                <Th>Order Date</Th>
                <Th>Paid Total</Th>
                <Th>Items</Th>
              </Tr>
            </Thead>
            <Tbody>
              {completedOrders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order.username}</Td>
                  <Td>
                    {new Date(order.createdAt).toLocaleString("el-GR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Td>
                  <Td>{parseFloat(order.totalPrice).toFixed(2)}€</Td>
                  <Td>
                    {order.orderItems.map((item) => (
                      <UnorderedList key={item._id}>
                        <ListItem>
                          {item.qty} x {item.name} ({item.price.toFixed(2)}€ each)
                        </ListItem>
                      </UnorderedList>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CompletedOrdersTab;
