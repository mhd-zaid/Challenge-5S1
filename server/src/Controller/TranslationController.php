<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TranslationController extends AbstractController
{
    #[Route(path: "/translations/{locale}/{namespace}", name: "get_translation", methods: ["GET"])]
    public function getTranslationData(Request $request, string $locale, string $namespace): Response
    {
        $translationFilePath = $this->getParameter('kernel.project_dir') . '/translations/' . $locale . '/'.$namespace.'.json';
        
        if (!file_exists($translationFilePath)) {
            throw $this->createNotFoundException('The translation file does not exist');
        }

        $translationContent = file_get_contents($translationFilePath);

        return new Response($translationContent, 200, [
          'Content-Type' => 'application/json',
        ]);
    }
}