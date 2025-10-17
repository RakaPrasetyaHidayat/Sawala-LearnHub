'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import FileItem from '@/components/molecules/upload/file-item'
import { Button } from '@/components/atoms/ui/button'

type FileEntry = {
  id: string
  name: string
  sizeLabel: string
}

const seededFiles: FileEntry[] = [
  {
    id: 'seed-0',
    name: 'WhatsApp_Image_2025-09-12_at_10.49.34.jpeg',
    sizeLabel: '19.3 KB'
  }
]

export default function UserSubmissions() {
  const [files, setFiles] = useState<FileEntry[]>(seededFiles)

  const handleRemove = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  return (
    <div className='p-4 flex flex-col gap-4'>
      <div className='flex items-center gap-x-[5px] mb-7'>
        <Image src='/assets/icons/arrow-left.png' alt='arrow-left' width={12} height={16} />
        <p className='text-lg font-bold'>Detail Task</p>
      </div>
      <div>
        <h2 className='text-base font-bold'>Pre Test for All intern</h2>
        <h2 className='text-base font-normal text-[#595959]'>Deadline: 14 Aug 2024, 18:00</h2>
      </div>
      <div>
        <p className='text-base font-normal text-[#595959]'>This pre-test evaluates the foundational knowledge of UI/UX design principles, including user-centered design, wireframing, visual hierarchy, and basic tools. It helps assess the intern's readiness for hands-on design tasks.</p>
      </div>
      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          {files.length > 0 ? (
            files.map(file => (
              <FileItem
                key={file.id}
                name={file.name}
                sizeLabel={file.sizeLabel}
                onRemove={() => handleRemove(file.id)}
              />
            ))
          ) : (
            <p className='text-sm text-gray-500'>No files uploaded yet.</p>
          )}
        </div>
        <div className='flex flex-row gap-2'>
          <p>Status : </p>
          <div className='px-3 bg-[#DBEAFE] text-blue-500 text-sm font-medium rounded-full flex items-center justify-center'>
            <h5>Submitted</h5>
          </div>
        </div>
      </section>
      <div>
        <h3 className='text-base font-bold'>Feedback</h3>
        <div className='p-2 border border-1 border-gray-300 rounded-sm'>
          <p className='text-gray-400'>Revision Note</p>
        </div>
        <div className='pt-2'>
          <Button type='button' className='bg-[#2B7FFF]'>Approve</Button>
          <Button type='button' className='ml-2 bg-[#FFF085] text-black border border-1 border-gray-300 hover:text-white'>Revisi</Button>
        </div>
      </div>
    </div>
  )
}