import { Tag, Modal, Skeleton } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import { useState } from "react";

export default function OrderDetails({ currentRowOrderId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };
//will fetch the specific order data from currentRowOrderId 
  if (isLoading) {
    return (
      <>
        <Skeleton active />
        <Skeleton active className="py-7" />
        <Skeleton active />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p>
        <span className="font-bold">Created At : </span> 12312312/123123
      </p>
      <p>
        <span className="font-bold">Status :</span> <Tag>Pending</Tag>
      </p>

      <div className="bg-white p-6 flex flex-col gap-2 mt-5 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold pb-2">Customer Details</h3>
          <span className="text-base cursor-pointer">
            <EditTwoTone />
          </span>
        </div>

        <div className="flex gap-20 text-sm">
          <div className="font-semibold flex flex-col gap-1">
            <label>Name:</label>
            <label>Phone Number:</label>
            <label>Email:</label>
            <label>Address:</label>
            <label>City:</label>
            <label>Province:</label>
            <label>Order Note:</label>
          </div>

          <div className="flex flex-col gap-1">
            <p>Raunak Shrestha</p>
            <p>9851313209</p>
            <p>raunak@gmail.com</p>
            <p>Baneshwor</p>
            <p>Kathmandu</p>
            <p>3</p>
            <p>please call me before delivery</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 flex flex-col gap-2 mt-5 rounded-xl">
        <h3 className="text-lg font-bold pb-2">Order Summary</h3>

        <h4 className="font-semibold border-b-2 py-1">Cart Items</h4>
      </div>
    </div>
  );
}