'use client';
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const metadata = [
  {
    id: 'bimo-1',
    name: 'Bimo',
    position: 'UI/UX Designer',
    status: 'Submitted',
    avatar: '/assets/icons/profile.png',
  },
  {
    id: 'bimo-2',
    name: 'Bimo',
    position: 'UI/UX Designer',
    status: 'Submitted',
    avatar: '/assets/icons/profile.png',
  },
  {
    id: 'bimo-3',
    name: 'Bimo',
    position: 'UI/UX Designer',
    status: 'Submitted',
    avatar: '/assets/icons/profile.png',
  },
  {
    id: 'bimo-4',
    name: 'Bimo',
    position: 'UI/UX Designer',
    status: 'Submitted',
    avatar: '/assets/icons/profile.png',
  },
];

export default function DetailTaskAdmin() {
  const navigateTo = useRouter();
  return (
    <div className='p-4 flex flex-col gap-4'>
      {/* Back Button */}
      <div className='flex items-center gap-x-[5px] mb-7'>
        <Image src="/assets/icons/arrow-left.png" alt="arrow-left" width={12} height={16} />
        <p className='text-lg font-bold'>Detail Task</p>
      </div>
      <div>
        <h2 className='text-base font-bold'>Pre Test for All intern</h2>
        <h2 className='text-base font-normal text-[#595959]'>Deadline: 14 Aug 2024, 18:00</h2>
      </div>
      <div className=''>
        <p className='text-base font-normal text-[#595959]'>This pre-test evaluates the foundational knowledge of UI/UX design principles, including user-centered design, wireframing, visual hierarchy, and basic tools. It helps assess the intern's readiness for hands-on design tasks.</p>
      </div>
      <div>
        <div className='py-4'>
          <h2 className='text-base font-bold '>User Submissions</h2>
        </div>
        {/* User Submission Content */}
        <div className='flex flex-col gap-4'>
          {metadata.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => navigateTo.push('/admin/UserSubmissions')}
              className='text-left'
            >
              <div className='p-[16px] rounded-sm border border-1 border-gray flex flex-row'>
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={71}
                  height={73}
                />
                <div className='flex flex-col'>
                  <div className='ml-3'>
                    <h2 className='font-semibold text-base'>{item.name}</h2>
                    <p className='text-xs font-normal text-[#595959]'>{item.position}</p>
                  </div>
                  <div className='bg-[#DBEAFE] text-blue-500 text-sm font-medium rounded-full m-3 flex items-center justify-center'>
                    <h5>{item.status}</h5>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

