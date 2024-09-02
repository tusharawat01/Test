import Accordion from "./Accordian";

const FAQ = () => {
    return (
        <div className="p-0 md:px-16 my-10 text-left lg:mx-10 mx-3 rounded-lg  ">
            <h3 className='lg:text-6xl text-5xl my-10 font-bold'>FAQ&apos;s</h3>

            <Accordion
                title={"Can I Register if i don't have Drones ?"}
                answer={"Yes, you are welcome. All just we want relevant Pilot skills"}
            />
            <div className="bg-blue-500 h-[1px]"></div>
            <Accordion
                title="Can I Register if i don't have Pilot License ?"
                answer={`Yes, you are welcome, you will be eligible to receive jobs.`
                } />
            <div className="bg-blue-500 h-[1px]"></div>

      

            <Accordion title="Do I have to relocate?"
                answer="No, You can work from anywhere, we will provide you job which matches your service range and chosen areas." />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="What are the service areas used for?"
                answer="Service areas inform us where you prefer to fly your missions. This does not prevent you from receiving missions outside of this area. Our Pilot Success team may send you missions regardless of the service area you provide" />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="Who owns the data that you collect?"
                answer="Aero2Astro owns all data collected using our technology unless otherwise specified by the client" />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="What is your average turnaround time?"
                answer="Projects are typically ready within 2-5 business days with an ASAP mindset." />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="How will I access my data?"
                answer="Data is accessed through our proprietary portal or a viewable link to online deliverables. We can also use API tools to access existing systems for ease of delivery" />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="Do you service my area?"
                answer="If you are within the INDIA, absolutely! All inquiries originating outside the INDIA will be considered on an individual basis." />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="What packages do you offer for my industry?"
                answer="Aero2Astro does have set packages as per Industries Market standards. For more details you can contact us on +91 6006535445" />
            <div className="bg-blue-500 h-[1px]"></div>

            <Accordion title="What happens if I do not complete the registration process?"
                answer="You will not be able to accept or reject a mission for which you may be eligible.
You can complete the registration process by clicking the Finish Setup button or Registering through the form." />
            <div className="bg-blue-500 h-[1px]"></div>
            
            <Accordion title="How do I change my password?"
                answer="You can change your password on the login page using the Forgot Password option." />
            <div className="bg-blue-500 h-[1px]"></div>
            <Accordion title="How do I update my profile?"
                answer="You can change your profile before applying on the dashboard, profile page." />
            <div className="bg-blue-500 h-[1px]"></div>


        </div>
    );
}

export default FAQ;
