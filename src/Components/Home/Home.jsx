import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import ChoosePorfira from '../ChoosePorfira/ChoosePorfira';
import Porfiraworks from '../Porfiraworks/Porfiraworks';
import Testimonials from '../Testimonials/Testimonials';
import Learning from '../Learning/Learning';


const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <ChoosePorfira></ChoosePorfira>
            <Porfiraworks></Porfiraworks>
            <Testimonials></Testimonials>
            <Learning></Learning>
        </div>
    );
};

export default Home;