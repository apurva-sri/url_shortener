import { motion } from "framer-motion";

import Container from "../../common/Container";
import Section from "../../common/Section";

function LaptopShowcase() {
  return (
    <Section>
      <Container>
        <motion.div
          initial={{
            opacity: 0,
            y: 80,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="mx-auto max-w-6xl">
            {/* Laptop */}

            <div className="rounded-[40px] border-8 border-neutral-900 bg-neutral-900 shadow-2xl">
              <div className="aspect-video rounded-[28px] bg-white p-10">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black">LinkPilot Dashboard</h3>

                    <p className="text-neutral-500">Analytics Overview</p>
                  </div>

                  <div className="rounded-full bg-black px-5 py-2 text-white">
                    PRO
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-3xl bg-neutral-100 p-6">
                    <p>Total Links</p>

                    <h2 className="mt-3 text-4xl font-black">254</h2>
                  </div>

                  <div className="rounded-3xl bg-neutral-100 p-6">
                    <p>Total Clicks</p>

                    <h2 className="mt-3 text-4xl font-black">92K</h2>
                  </div>

                  <div className="rounded-3xl bg-neutral-100 p-6">
                    <p>QR Codes</p>

                    <h2 className="mt-3 text-4xl font-black">34</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Bottom */}

            <div className="mx-auto h-5 w-[75%] rounded-b-full bg-neutral-400 blur-[1px]" />
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default LaptopShowcase;
