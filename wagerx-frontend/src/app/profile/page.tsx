import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import wave from "@/app/images/wave.png";
import Footer from "@/components/footer";

function Profile() {
  return (
    <Layout>
      <section className="relative overflow-hidden px-4 pt-16 md:px-6 md:pt-24">
        <div className="flex justify-center">
          <h1 className="font-oxanium text-white text-[30px]">Profile</h1>
        </div>
        <div className="mx-[400px] flex items-center justify-end  mt-2 z-10 relative">
          <div className="first-purple-bar" />
          <button className="border-[#AD1AAF] font-oxanium border-2 px-10 bg-transparent backdrop-blur-xl text-white hover:text-white  hover:bg-[#AD1AAF]">
            Edit ✎
          </button>
          <div className="last-purple-bar" />
        </div>
        <div className="mx-[200px] mt-10">
          <div className="flex items-center space-x-5">
            <div>
              <p className="font-oxanium text-[20px] mb-5 text-white">Name</p>
              <Input
                disabled={true}
                value={"Kaushik"}
                className="h-16 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[500px] mx-auto  text-white"
              />
            </div>
            <div>
              <p className="font-oxanium text-[20px] mb-5 text-white">Email</p>
              <Input
                disabled={true}
                value={"kaushik@gmail.com"}
                className="h-16 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[500px] mx-auto text-white"
              />
            </div>
          </div>
        </div>
        <div className="mx-[400px] mt-10">
          <p className="font-oxanium text-[20px] my-5 text-white">
            Wallet Address
          </p>
          <Input
            disabled={true}
            value={"0x1313qwcsd32e23"}
            className="h-16 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[620px] mx-auto text-white"
          />
          <p className="font-oxanium text-[20px] my-5 text-white">Balance</p>
          <Input
            disabled={true}
            value={"0.5652 ETH"}
            className="h-16 bg-transparent pl-12 backdrop-blur-xl border-[#A7A7A7] w-[620px] mx-auto text-white"
          />
        </div>

        <div
          className="absolute  inset-[0px] top-[150px]  left-[-250px] bg-no-repeat  h-[500px]  opacity-90"
          style={{
            backgroundImage: "url('/images/Vector-1.png')"
          }}
        />
        <div className="mt-[80px]">
          <div className="flex items-center justify-center">
            <div className="shape-container">
              <div className="right-bar" />
            </div>
            <Link
              href="/dashboard"
              className="relative mx-1 bg-[#AD1AAF] text-white px-6 py-3 text-lg font-medium transition-all hover:bg-[#8c158e] hover:shadow-lg hover-shake"
            >
              {/* Button Text */}
              <div className="first-bar" />
              <span className="relative z-10 font-oxanium">Update Profile</span>
              <div className="last-bar" />
            </Link>
            <div className="shape-container">
              <div className="right-bar" />
            </div>
          </div>
        </div>
        <Image src={wave} className="w-full" alt="" />
      </section>
      <Footer />
    </Layout>
  );
}

export default Profile;
