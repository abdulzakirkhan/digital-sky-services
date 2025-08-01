"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cards from "@/components/Cards";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  useGetAllBannerQuery,
  useGetOrderByPaymentTypeQuery,
} from "@/redux/order/ordersApi";
import { appNameCode } from "@/config";
import { useGetStandardValuesQuery } from "@/redux/shared/sharedApi";
import { ORDERS_TYPES } from "@/config/constants";
import { getOrderTypeValues } from "@/config/myWebHelpers";
import { useGetProfileQuery } from "@/redux/user/profileApi";
import { useGetTokenQuery } from "@/redux/auth/authApi";
import { useDispatch } from "react-redux";
import { ChangeUser } from "@/redux/auth/authSlice";

const DashboardPage = () => {
  const orderType = ORDERS_TYPES.ALL_ORDERS;
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.userid;
  const { data: profileData } = useGetProfileQuery(user?.userid);
  const router = useRouter();
  // const isVerified = false; // Uncomment this line to simulate unverified user
  const isVerified = user?.isVerified;

  const [showFilter, setShowFilter] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdwon = () => {
    setShowFilter(!showFilter);
  };

  const handleBannerClick = (bannerId) => {
    console.log("Banner clicked with ID:", bannerId);
    // You can also trigger navigation or another API call here
    // For example:
    // router.push(`/banners/${bannerId}`)
  };

  const {
    data: standardValues,
    isLoading,
    error,
  } = useGetStandardValuesQuery(userId, {
    skip: !userId, // <-- prevents call if undefined
  });

  const { data: getAllBanners, isLoading: getAllBannerLoading } =
    useGetAllBannerQuery({ app: appNameCode });

  const getAllorderBody = new FormData();
  getAllorderBody.append("id", user?.userid);
  getAllorderBody.append("paymentstatus", getOrderTypeValues(orderType));

  const {
    data: getAllOrders = { result: { orderAll: [] } },
    isFetching: getAllOrdersLoading,
  } = useGetOrderByPaymentTypeQuery(getAllorderBody);

  const [allOrders, setAllOrders] = useState([]);
  const [applyFilter, setApplyFilter] = useState([]);
  const [orderToShown, setOrderToShown] = useState(allOrders);

  const completedOrders = allOrders?.filter(
    (order) => order?.orderprogress === "Completed"
  );
  const inProgressOrders = allOrders?.filter(
    (order) => order?.orderprogress === "Working"
  );

  const cardsData = [
    {
      id: 1,
      title: "Total Order",
      title: "Total Orders",
      count: allOrders?.length || 0,
      time: "Up from yesterday",
      percentage: "8.5%",
      icon: "/home/icons/orders.png",
      bg: "/home/primarybg.svg",
      statusIcon: "/icons/home/up.svg",
    },
    {
      id: 2,
      title: "In Progress",
      count: inProgressOrders?.length || 0,
      time: "Up from past week",
      percentage: "1.3%",
      icon: "/home/icons/progress.png",
      bg: "/home/orange.svg",
      statusIcon: "/icons/home/progress.svg",
    },
    {
      id: 3,
      title: "Completed",
      count: completedOrders?.length || 0,
      time: "Up from Yesterday",
      percentage: "1.8%",
      icon: "/home/icons/completed.png",
      bg: "/home/green.svg",
      statusIcon: "/icons/home/completed.svg",
    },
  ];

  useEffect(() => {
    const handleRouteChange = () => setShowFilter(false);
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (
      getAllOrders?.result?.orderAll?.length > 0 &&
      Array.isArray(getAllOrders?.result?.orderAll)
    )
      setAllOrders(getAllOrders?.result?.orderAll);
  }, [getAllOrders]);

  const { data: getToken = { result: {} } } = useGetTokenQuery();
  const dispatch = useDispatch();

useEffect(() => {
  if (getToken?.result?.token && user) {
    dispatch(ChangeUser({ ...user, token: getToken?.result?.token }));
  }
}, [getToken]);


  useEffect(() => {
    if (!getToken?.result?.token || !user) return;

    const setupOneSignalTags = async () => {
      try {
        if (!window.OneSignalInstance) {
          console.log("OneSignalInstance is NOT ready yet.");
          return;
        }

        console.log("OneSignalInstance is available. Setting up listener...");

        // Check current subscription status immediately
        const currentSubscriptionId = window.OneSignalInstance.User.PushSubscription.id;
        if (currentSubscriptionId) {
          console.log("Already subscribed with ID:", currentSubscriptionId);
          await addUserTag(user?.userid);
        }

        // Setup listener for future changes
        window.OneSignalInstance.User.PushSubscription.addEventListener(
          "change",
          async (subscriptionChange) => {
            console.log("PushSubscription change event fired:", subscriptionChange);
            
            if (subscriptionChange.current.id) {
              await addUserTag(user?.userid);
            } else {
              console.log("User unsubscribed");
            }
          }
        );
      } catch (error) {
        console.error("Error in OneSignal setup:", error);
      }
    };

    const addUserTag = async (id) => {
      try {
        console.log("Attempting to add userId tag:", id);

        if(!id){
          return;
        }

        const tagValue = String(id).trim();
        await window.OneSignalInstance.User.addTag("userId", tagValue);
        
        // Verify the tag was added
        const tags = await window.OneSignalInstance.User.getTags();
        console.log("Current OneSignal Tags:", tags);
        
        if (!tags || tags.userId !== tagValue) {
          console.warn("Tag might not have been set correctly. Retrying...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          await addUserTag(tagValue);
        }
      } catch (tagError) {
        console.error("Error adding user tag:", tagError);
      }
    };

    if(user){
      setupOneSignalTags();
    }
  }, [getToken, user,userId]);
  

 

  return (
    <section className={`mt-20`}>
      <div className="container mx-auto py-8">
        {getAllBanners?.result?.banners?.length > 0 && (
          <div className="w-full overflow-x-auto py-4 flex gap-4 px-4 justify-center items-center flex-wrap">
            {getAllBanners.result.banners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner.id)}
                className="min-w-[300px] cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={banner.imagelink}
                  alt={banner.desc || "Banner"}
                  width={600}
                  height={250}
                  className="rounded-lg shadow-md object-cover"
                />
                <p className="text-center mt-2 text-sm text-gray-600">
                  {banner.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {isVerified ? (
          <>
            <motion.div
              className="lg:w-full flex flex-wrap justify-center sm:justify-between items-center"
              initial={{ opacity: 0, y: 20 }} // Starts with opacity 0 and a slight upward offset
              whileInView={{ opacity: 1, y: 0 }} // Fades in and slides to the original position
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Header */}
              <motion.h2
                className="px-5 md:px-0"
                initial={{ opacity: 0, y: -20 }} // Starts with opacity 0 and slight offset from above
                whileInView={{ opacity: 1, y: 0 }} // Fades in and moves to the original position
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Delay for staggered effect
              >
                My Orders
              </motion.h2>

              <div className="flex items-center wrap gap-4 mt-4 mb-2 lg:gap-12">
                {/* Add Order Button */}
                <motion.div
                  className="w-219 flex justify-center items-center cursor-pointer w-h40 bg-primary hover:bg-primary-dark transition-colors rounded-md btnText text-white h-[40]"
                  initial={{ opacity: 0, scale: 0.8 }} // Starts smaller and transparent
                  whileInView={{ opacity: 1, scale: 1 }} // Fades in and scales to full size
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }} // Delay for staggered effect
                >
                  <Link href={"/initiate-order"}>Add Order</Link>
                </motion.div>

                {/* Filter Button */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={handleDropdwon}
                    className="bg-orange w-219 btnText text-white rounded-md w-h104 w-[104] hover:bg-primary-dark transition-colors h-[40] flex justify-center items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }} // Starts smaller and transparent
                    whileInView={{ opacity: 1, scale: 1 }} // Fades in and scales to full size
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }} // Delay for staggered effect
                  >
                    <Image
                      src={"/icons/home/filter.svg"}
                      width={12}
                      height={5}
                      alt="" 
                    />
                    Filter
                  </motion.button>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white border-2 shadow-lg rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <span
                          onClick={() => setShowFilter(false)}
                          className="text-primary text-2xl -mt-1 cursor-pointer"
                        >
                          &lt;
                        </span>
                        <h3 className="text-center pb-2 border-b-2">
                          Apply Filters
                        </h3>
                      </div>
                      <div className="py-3 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <label htmlFor="progress">Progress</label>
                          <input
                            type="checkbox"
                            id="progress"
                            name="progress"
                          />
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <label htmlFor="completed">Completed</label>
                          <input
                            type="checkbox"
                            id="completed"
                            name="completed"
                          />
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <label htmlFor="Paid">Paid</label>
                          <input type="checkbox" id="Paid" name="Paid" />
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <label htmlFor="Unpaid">Unpaid</label>
                          <input type="checkbox" id="Unpaid" name="Unpaid" />
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <label htmlFor="ppaid">Partially Paid</label>
                          <input type="checkbox" id="ppaid" name="ppaid" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Cards */}
            <div className="grid md:grid-cols-12 gap-5 py-8">
              {cardsData.map((card, index) => (
                <Cards card={card} index={index} key={card.id} />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            className="w-full flex flex-col items-center justify-center text-center bg-white shadow-md rounded-lg p-6 md:p-10 border border-red-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-2">
              Phone Number Not Verified
            </h2>

            <p className="text-gray-700 mb-6 max-w-xl">
              You need to verify your phone number to access order-related
              features like Accessing Orders, Payment History, and Wallet.
              Please click the button below to verify your phone number.
            </p>

            <button
              onClick={() => router.push("/phone-number-verification")}
              type="button"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Verify Phone Number
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
