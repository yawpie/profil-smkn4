import { NextApiRequest, NextApiResponse } from 'next';
import type { Slide } from '@/types/Slide';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Sesuaikan dengan kebutuhan Anda
    },
  },
};

let slidesData: Slide[] = 
[
  // {
  //   id: 'slide-1',
  //   image: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1920&q=90',
  //   alt: 'Siswa belajar di kelas',
  //   title: 'Selamat Datang di SMKN 4',
  //   subtitle: 'Wujudkan Masa Depan Cemerlangmu Bersama Kami',
  //   description: 'SMKN 4 menawarkan pendidikan kejuruan unggul dengan fasilitas modern dan kurikulum relevan industri.',
  //   gradientFrom: 'from-blue-900',
  //   gradientTo: 'to-blue-500',
  //   order: 1,
  //   isActive: true,
  // },
  // {
  //   id: 'slide-2',
  //   image: 'https://images.unsplash.com/photo-1505678229849-6293c9984632?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmFjaWxpdHl8ZW58MHx8MHx8A%3D%3D&auto=format&fit=crop&w=1920&q=90',
  //   alt: 'Laboratorium komputer modern',
  //   title: 'Fasilitas Belajar Terbaik',
  //   subtitle: 'Laboratorium Lengkap, Siap Mengembangkan Potensimu',
  //   description: 'Nikmati akses ke lab komputer canggih, bengkel praktik, dan perpustakaan digital.',
  //   gradientFrom: 'from-gray-700',
  //   gradientTo: 'to-gray-400',
  //   order: 2,
  //   isActive: true,
  //  },
  //  {
  //   id: 'slide-3',
  //   image: 'https://images.unsplash.com/photo-1519389950473-47a0f98683bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZXh0cmFjdXJyaWN1bGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1920&q=90',
  //   alt: 'Siswa bekerja sama dalam tim',
  //   title: 'Ekstrakurikuler Beragam',
  //   subtitle: 'Kembangkan Minat dan Bakatmu di Luar Akademik',
  //   description: 'Dari olahraga hingga seni, temukan kegiatan yang cocok untukmu dan raih prestasi.',
  //   gradientFrom: 'from-purple-800',
  //   gradientTo: 'to-pink-500',
  //   order: 3,
  //   isActive: true,
  //  },
];

const MAX_SLIDES = 3;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Slide[] | Slide | { message: string; id?: string }>
) {
  // Tanpa fs, kita langsung bekerja dengan slidesData in-memory
  // Penting: Variabel slidesData ini akan di-reset setiap server Next.js di-restart.

  if (req.method === 'GET') {
    const sortedSlides = slidesData.sort((a, b) => a.order - b.order);
    res.status(200).json(sortedSlides);
  } else if (req.method === 'POST') {
    const { image, alt, title, subtitle, description, gradientFrom, gradientTo, order, isActive } = req.body as Partial<Slide>;

    if (!title || !description || typeof order === 'undefined' || !image) {
      return res.status(400).json({ message: 'Data slide tidak lengkap. Pastikan judul, deskripsi, urutan, dan URL gambar terisi.' });
    }

    if (slidesData.length >= MAX_SLIDES) {
      return res.status(400).json({ message: `Tidak dapat menambah slide baru. Maksimal ${MAX_SLIDES} slide.` });
    }
    
    if (order > MAX_SLIDES || order < 1) {
      return res.status(400).json({ message: `Urutan slide harus antara 1 dan ${MAX_SLIDES}.` });
    }

    const existingOrders = new Set(slidesData.map(s => s.order));
    if (existingOrders.has(order)) {
        return res.status(400).json({ message: `Urutan ${order} sudah digunakan. Harap pilih urutan lain.` });
    }

    const newId = `slide-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const newSlide: Slide = {
      id: newId,
      image: image,
      alt: alt || title || `Slide ${newId}`,
      title: title,
      subtitle: subtitle || '',
      description: description,
      gradientFrom: gradientFrom || '',
      gradientTo: gradientTo || '',
      order: order,
      isActive: isActive ?? true,
    };

    slidesData.push(newSlide);
    slidesData.sort((a, b) => a.order - b.order);
    
    res.status(201).json(newSlide);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Slide> & { id: string };

    if (!id) {
      return res.status(400).json({ message: 'Slide ID diperlukan untuk pembaruan.' });
    }

    let foundSlideIndex = -1;
    let oldOrder = -1;

    slidesData.forEach((slide, index) => {
      if (slide.id === id) {
        foundSlideIndex = index;
        oldOrder = slide.order;
      }
    });

    if (foundSlideIndex === -1) {
      return res.status(404).json({ message: 'Slide tidak ditemukan.' });
    }

    const newOrder = typeof updatedFields.order !== 'undefined' ? updatedFields.order : oldOrder;

    if (newOrder > MAX_SLIDES || newOrder < 1) {
      return res.status(400).json({ message: `Urutan slide harus antara 1 dan ${MAX_SLIDES}.` });
    }

    if (newOrder !== oldOrder) {
      const targetSlideIndex = slidesData.findIndex(slide => slide.order === newOrder);

      if (targetSlideIndex !== -1) {
        const slideToSwap = slidesData[targetSlideIndex];
        slidesData[targetSlideIndex] = { ...slideToSwap, order: oldOrder };
      }
    }

    slidesData[foundSlideIndex] = {
      ...slidesData[foundSlideIndex],
      ...updatedFields,
      id: slidesData[foundSlideIndex].id,
      image: updatedFields.image || slidesData[foundSlideIndex].image, // Update image jika ada
      alt: updatedFields.alt || slidesData[foundSlideIndex].alt,
      title: updatedFields.title || slidesData[foundSlideIndex].title,
      description: updatedFields.description || slidesData[foundSlideIndex].description,
      order: newOrder,
      isActive: typeof updatedFields.isActive !== 'undefined' ? updatedFields.isActive : slidesData[foundSlideIndex].isActive,
    };

    slidesData.sort((a, b) => a.order - b.order);

    res.status(200).json({ message: 'Slide berhasil diperbarui.', id: id });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const slideIdToDelete = id ? String(id) : null;

    if (!slideIdToDelete) {
      return res.status(400).json({ message: 'Slide ID diperlukan untuk penghapusan.' });
    }

    const initialLength = slidesData.length;
    slidesData = slidesData.filter(slide => slide.id !== slideIdToDelete);

    if (slidesData.length === initialLength) {
      return res.status(404).json({ message: 'Slide tidak ditemukan.', id: slideIdToDelete });
    }

    slidesData.forEach((slide, index) => {
        slide.order = index + 1;
    });
    slidesData.sort((a, b) => a.order - b.order);

    res.status(200).json({ message: 'Slide berhasil dihapus.', id: slideIdToDelete });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Metode ${req.method} Tidak Diizinkan`);
  }
}