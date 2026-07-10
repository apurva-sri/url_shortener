import { motion } from "framer-motion";

import Badge from "../../common/Badge";
import Button from "../../common/Button";
import Container from "../../common/Container";
import Input from "../../common/Input";
import Section from "../../common/Section";

function Hero() {
  return (
    <Section className="pt-44">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
            }}
          >
            <Badge>✨ Link Management Platform</Badge>

            <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight lg:text-7xl">
              Every Click
              <br />
              Has A Story.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-500">
              Shorten links, generate QR codes, protect URLs with passwords,
              track analytics, and understand every visitor — all in one
              beautiful platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg">Get Started</Button>

              <Button variant="secondary" size="lg">
                Live Demo
              </Button>
            </div>

            <div className="mt-12 max-w-lg">
              <Input placeholder="Paste your long URL..." />
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
            }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Dashboard Preview</h3>

                  <p className="text-sm text-neutral-500">Live Analytics</p>
                </div>

                <Badge>Active</Badge>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-neutral-100 p-5">
                  <p className="text-sm text-neutral-500">Total Clicks</p>

                  <h2 className="mt-2 text-4xl font-black">18,247</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-neutral-100 p-5">
                    <p className="text-sm text-neutral-500">QR Codes</p>

                    <h3 className="mt-2 text-2xl font-bold">67</h3>
                  </div>

                  <div className="rounded-2xl bg-neutral-100 p-5">
                    <p className="text-sm text-neutral-500">Links</p>

                    <h3 className="mt-2 text-2xl font-bold">123</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export default Hero;
