import { ArrowLeft, Check, Crown, Sparkles, Zap } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { createPayment, verifyPayment } from '../src/features/payment'

const plans = [
    {
        key: "free",
        name: "Free",
        description: "For trying out the AI IDE.",
        price: "₹0",
        period: "/month",
        credits: "100 AI credits",
        icon: Zap,
        features: [
            "100 AI credits",
            "AI code generation",
            "Project editor",
            "HTML / CSS / JS preview",
            "React preview",
            "Basic project management",
        ],
        button: "Current Plan",
        current: true,
    },
    {
        key: "pro",
        name: "Pro",
        description: "For developers who build regularly.",
        price: "₹299",
        period: "/month",
        credits: "500 AI credits",
        icon: Sparkles,
        popular: true,
        features: [
            "500 AI credits ",
            "Everything in Free",
            "Priority AI generation",
            "Larger projects",
            "Unlimited projects",
            "Advanced AI coding",
            "Priority support",
        ],
        button: "Upgrade to Pro",
    },
    {
        key: "team",
        name: "Team",
        description: "For teams building products together.",
        price: "₹799",
        period: "/month",
        credits: "2,000 AI credits",
        icon: Crown,
        features: [
            "2,000 AI credits",
            "Everything in Pro",
            "Team collaboration",
            "Shared projects",
            "Higher AI limits",
            "Priority processing",
            "Team support",
        ],
        button: "Upgrade to Team",
    },
]

const Plan = () => {

    const navigate = useNavigate();

    const loadRazorpay = () => new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Unable to load Razorpay checkout"));
        document.body.appendChild(script);
    });

    const handlePayment = async (plan) => {
        try {
            if (plan.key == "free" || plan.current) {
                return;
            }

            await loadRazorpay();
            if (typeof window.Razorpay !== "function") {
                throw new Error("Razorpay checkout is not available");
            }

            const data = await createPayment(plan.key);
            console.log("data from create pay: ", data);
            if (!data?.order?.id || !data?.key_id) {
                throw new Error(data?.message || "Unable to create payment order");
            }

            const options = {
                key: data.key_id,
                amount: data.order.amount,
                currency: data.order.currency || "INR",
                name: "AI Code",
                description: `${plan.name}`,
                order_id: data.order.id,

                handler: async (resp) => {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = resp;
                    const result = await verifyPayment({razorpay_order_id, razorpay_payment_id, razorpay_signature});
                    if (!result) {
                        console.error("Payment verification failed");
                        return;
                    }
                    console.log("Payment verified", result);
                },
                theme : {
                    color : '#4f46e5'
                }
            }

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response) => {
                console.error("Payment failed", response.error);
            });
            razorpay.open();
        } catch (error) {
            console.error("error in create payment:", error);
        }
    }


    return (
        <div className="min-h-screen bg-[#0a0a0c] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
            <div className="relative mx-auto max-w-6xl">
                <div className="mb-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className='
  flex
  items-center
  gap-2
  rounded-lg
  border
  border-white/[0.08]
  bg-white/[0.03]
  px-3
  py-2
  text-sm
  font-medium
  text-zinc-300
  transition
  hover:bg-white/[0.06]
'>

                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className=' text-sm font-semibold'>
                        AI Code
                    </div>
                </div>


                <div className='mx-auto mb-12 max-w-2xl text-center'>
                    <div className='mx-auto
  mb-4
  flex
  w-fit
  items-center
  gap-2
  rounded-full
  border
  border-indigo-500/20
  bg-indigo-500/10
  px-3
  py-1.5
  text-xs
  font-medium
  text-indigo-300'>

                        <Sparkles size={13} /> Simple pricing for developers
                    </div>


                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Build more.
                        <span className="text-indigo-500">
                            {" "}Ship faster.
                        </span>
                    </h1>


                    <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Choose a plan that gives you the AI credits
                        you need to build and iterate faster.
                    </p>
                </div>


                <div className='grid gap-5 md:grid-cols-3'>
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                whileHover={{ y: -4 }}

                                className={`
  relative
  flex
  flex-col
  rounded-2xl
  border
  p-6
  transition
  ${plan.popular
                                        ? `
      border-indigo-500/40
      bg-indigo-500/[0.08]
      shadow-xl
      shadow-indigo-500/10
    `
                                        : `
      border-white/[0.08]
      bg-white/[0.025]
    `}
`}
                            >


                                {plan.popular && (
                                    <div className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white'>
                                        Most Popular
                                    </div>
                                )}
                                <div className="
  mb-5
  flex
  h-10
  w-10
  items-center
  justify-center
  rounded-xl
  bg-white/[0.06]
  text-white
">


                                    <Icon size={16} />
                                </div>
                                <h2 className='text-lg font-bold text-white'>{plan.name}</h2>
                                <p className='mt-1 min-h-[40px] text-xs leading-5 text-slate-500 dark:text-slate-400'>
                                    {plan.description}
                                </p>
                                <div className='mt-5 flex items-end gap-1'>
                                    <span className='text-3xl font-bold tracking-tight'>{plan.price}</span>
                                    <span className='mb-1 text-xs text-slate-400'>{plan.period}</span>
                                </div>

                                <div className="
  mt-4
  flex
  items-center
  gap-2
  rounded-lg
  border
  border-white/[0.07]
  bg-white/[0.04]
  px-3
  py-2.5
  text-xs
  font-semibold
  text-zinc-200
">
                                    <Zap className=' text-indigo-500' size={14} fill='currentColor' />
                                    {plan.credits}
                                </div>

                                <button onClick={() => handlePayment(plan)}
                                    className={`
    mt-5
    w-full
    rounded-lg
    py-2.5
    text-xs
    font-semibold
    transition
    ${plan.current
                                            ? `
          cursor-default
          bg-white/[0.06]
          text-zinc-500
        `
                                            : plan.popular
                                                ? `
    bg-indigo-600
    text-white
    shadow-lg
    shadow-indigo-500/20
    hover:bg-indigo-500
  `
                                                : `
    bg-white/[0.10]
    text-white
    hover:opacity-90
    hover:bg-white/[0.16]
  `
                                        }
  `}
                                >{plan.button}</button>


                                <div className="mt-6 border-t border-white/[0.07] pt-5">
                                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                        Includes
                                    </p>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2.5 text-xs text-zinc-300"
                                            >
                                                <Check size={13} className='mt-0.5 shrink-0 text-emerald-400' />

                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>




                            </motion.div>
                        )
                    })}
                </div>

                <div className='mt-10 text-center text-[11px] text-zinc-500'>
                    Credits reset every month. Unused credits do not roll over.
                </div>
            </div>
        </div>
    )
}

export default Plan
