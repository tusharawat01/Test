"use client"
import { pilotData, pilotProject } from "@/atom/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CiSettings } from "react-icons/ci";
import CircularProgress from "./components/cir";
import { getAllProj } from "@/routes/PilotProj";

const Skills = () => {
    const [allProj, setAllProj] = useRecoilState(pilotProject);
    const [currentUser, setCurrentUser] = useRecoilState(pilotData);

    useEffect(() => {
        getAllProj(setAllProj);
    }, []);

    // Group projects by tag
    const projectsByTag = allProj?.reduce((acc, project) => {
        const tag = project.tag;
        if (!acc[tag]) {
            acc[tag] = 0;
        }
        acc[tag]++;
        return acc;
    }, {});

    return (
        <div className="rounded-md shadow relative h-full min-h-40 bg-white ">
            <h2 className="text-lg flex items-center gap-2 border-b font-bold px-5 rounded-sm inset-x-0 py-1 text-gray-800">
                <CiSettings className="" />  Skills
            </h2>

            {/* Circular Progress Bars */}
            <div className="flex gap-4 items-center px-3 max-sm:justify-center overflow-x-scroll py-4" style={{scrollbarWidth:'none'}}>
                {projectsByTag && Object.entries(projectsByTag).map(([tag, count]) => {
                    const totalProjects = 100; // default
                    const percentage = (count / totalProjects) * 100;
                    const color = percentage < 50 ? 'orange' : 'green';

                    return (
                        <div key={tag} className="flex flex-col items-center">
                            <CircularProgress value={percentage} color={color} />
                            <span className="text-sm font-bold text-gray-700 mt-2">{tag}</span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

export default Skills;
