import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import user from "@/app/images/User.png";

export function CommentSection() {
  return (
    <div className="space-y-6 z-10 relative mt-20">
      <h3 className="text-xl font-bold text-white font-oxanium">COMMENTS</h3>

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <Textarea
            placeholder="Add Comment"
            className="bg-transparent border-[#F81DFB] text-white font-oxanium"
          />
          <Button className="bg-[#F81DFB] hover:bg-purple-700 font-oxanium">
            Post
          </Button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map(i =>
            <div key={i} className="flex gap-4 mt-2">
              <Image
                src={user}
                alt="User"
                width={30}
                height={10}
                className="rounded-full h-[30px]"
              />
              <div className="flex-1 rounded-r-xl rounded-bl-2xl bg-white/10 border-[#F81DFB] border p-4 backdrop-blur-xl">
                <p className="text-sm text-white font-oxanium">
                  Just a comment to test comment sections. Just a comment to
                  test comment sections. Just a comment to test comment sections
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
