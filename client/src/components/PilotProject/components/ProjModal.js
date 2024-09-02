"use client"

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, Spinner } from "@nextui-org/react";
import AddButton from "@/components/smallComponents/AddButton";
import RequiredStar from '@/components/smallComponents/RequiredStar';
import { getAllProj } from '@/routes/PilotProj';
import { toast } from 'react-toastify';

const ProjModal = ({ isOpen, setIsOpen, handleSubmit, loading, setData, data }) => {
  const [tags, setTags] = useState(['Solar', 'Tower', 'Building', 'Construction']);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const { title, location, startDate, endDate, type, rangeCovered } = data || {};
    if (title && location && startDate && endDate && type && rangeCovered) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [data]);


  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setIsAddTagOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Modal hideCloseButton isOpen={isOpen} className="flex items-center justify-center">
        <ModalContent className="overflow-y-auto max-h-[90vh]">
          <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
          <ModalBody>
            <form className="flex flex-col w-full p-2 gap-4 text-tiny md:text-sm">
              <div>
                <p className="mb-1">Project Tags <RequiredStar /></p>
                <div className="flex gap-2 flex-wrap items-center">
                  {tags?.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => setData((prevData) => ({ ...prevData, tag }))}
                      className={`px-2 cursor-pointer text-xs flex-wrap rounded-full hover:bg-blue-500 hover:text-white py-1 ${tag === data?.tag ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                      {tag}
                    </div>
                  ))}
                  <AddButton onClick={() => setIsAddTagOpen(true)} />
                </div>
              </div>

              <div>
                <p>Project Title <RequiredStar /></p>
                <input
                  name="title"
                  required
                  className="p-2 w-full rounded bg-gray-100 text-gray-800"
                  type="text"
                  placeholder="Project Title"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p>Project Type <RequiredStar /></p>
                  <select
                    name="type"
                    onChange={handleInputChange}
                    value={data?.type}
                    placeholder={'Select the Type'}
                    className="p-2 rounded bg-gray-100 text-gray-800"

                  >
                    <option value="linear videography" >Linear VideoGraphy</option>
                    <option value="linear mapping" >Linear Mapping</option>
                    <option value="area videography" >Area VideoGraphy</option>
                    <option value="area mapping" >Area Mapping</option>
                  </select>
                </div>
                <div>
                  <p>{data?.type === 'linear videography' || data?.type === 'linear mapping' ? 'Distance in Km' : 'Area in Acres'
                  } <RequiredStar /></p>
                  <input
                    name="rangeCovered"
                    className="p-2 rounded bg-gray-100 text-gray-800"
                    type="number"
                    min={0}
                    placeholder="Enter Value"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <p>Project Place</p>
                <input
                  name="location"
                  required
                  className="p-2 rounded w-full bg-gray-100 text-gray-800"
                  type="text"
                  placeholder="Place/Location"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p>Start Date <RequiredStar /></p>
                  <input
                    name="startDate"
                    className="p-2 rounded bg-gray-100 text-gray-800"
                    type="date"
                    placeholder="start date"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <p>End Date <RequiredStar /></p>
                  <input
                    name="endDate"
                    className="p-2 rounded bg-gray-100 text-gray-800"
                    type="date"
                    placeholder="end date"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

            </form>
          </ModalBody>
          <div className='flex items-center justify-end gap-3 w-full p-4'>
            <Button color="danger" variant="light" onPress={() => {
              setIsOpen(false);
              setData({
                startDate: '',
                endDate: '',
                location: '',
                title: '',
                tag: '',
                // status: "",
                type: 'linear videography',
                rangeCovered: ''
              })
            }}>
              Close
            </Button>
            {
              loading ?
                <Spinner /> :
                <Button color="primary" className='cursor-pointer' type="submit" onClick={(e) => {

                  if (data?.startDate > data?.endDate)
                    return toast.error("End Date cannot be smaller than start date")

                  handleSubmit(e)
                  setData(null)
                }
                } disabled={!isFormValid || loading}>
                  Save
                </Button>}
          </div>
        </ModalContent>
      </Modal>

      {/* Add Tag Modal */}
      <Modal isOpen={isAddTagOpen} onClose={() => setIsAddTagOpen(false)} className="flex items-center justify-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add New Tag</ModalHeader>
          <ModalBody>
            <form onSubmit={handleAddTag} className="flex flex-col w-full p-2 gap-4">
              <div>
                <p>New Tag</p>
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  required
                  className="p-2 w-full rounded bg-gray-100 text-gray-800"
                  type="text"
                  placeholder="Enter new tag"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-3 items-center">
            <Button color="danger" variant="light" onPress={() => setIsAddTagOpen(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit" onClick={handleAddTag}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjModal;
