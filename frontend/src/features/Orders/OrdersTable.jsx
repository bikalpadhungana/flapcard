import React, { useState } from "react";
import { Table, Tag, Drawer, Button } from "antd";
// import { OrderData } from "../../../data/ExampleOrderData.js";
import OrderDetails from "../../components/OrderDetails.jsx";

const columns = [
  {
    title: "Order Id",
    dataIndex: "orderId",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
  },
  {
    title: "Number",
    dataIndex: "number",
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    render: (_, { paymentStatus }) => {
      let color;
      if (paymentStatus === "unpaid") color = "";

      if (paymentStatus === "paid") color = "green";

      return <Tag color={color}>{paymentStatus?.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Order Status",
    dataIndex: "orderStatus",
    render: (_, { orderStatus }) => {
      let color;
      if (orderStatus === "confirmed") color = "green";
      if (orderStatus === "pending") color = "yellow";
      if (orderStatus === "canceled") color = "red";

      return <Tag color={color}>{orderStatus?.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Card Detail",
    dataIndex: "cardDetail",
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
  },
  {
    title: "Created",
    dataIndex: "created",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (_, data) => {
      return (
        <button
          className="text-red-500"
          onClick={() => console.log("Clicked on Delete")}
        >
          Delete
        </button>
      );
    },
  },
];

function OrdersTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRowOrderId, setCurrentRowOrderId] = useState(null);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return (
    <>
      <Drawer
        title={`Order ID #${currentRowOrderId}`}
        placement="right"
        width="700"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen((open) => !open);
        }}
        style={{background: "#F5F5F5"}}
        extra={<button></button>}
      >
        <OrderDetails currentRowOrderId={currentRowOrderId}/>
      </Drawer>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={OrderData}
        bordered={true}
        onRow={(record, bv) => ({
          onClick: () => {
            setCurrentRowOrderId(record.orderId);
            setDrawerOpen(true);
          },
        })}
        onSelect={
          (record) =>{
            console.log(record.orderId)
          }
        }
      />
    </>
  );
}
export default OrdersTable;