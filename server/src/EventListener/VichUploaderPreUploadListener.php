<?php
namespace App\EventListener;

use Vich\UploaderBundle\Event\Event;
use Vich\UploaderBundle\Event\EventDispatcher;
use Vich\UploaderBundle\Storage\StorageInterface;

class VichUploaderPreUploadListener
{
    private $storage;

    public function __construct(StorageInterface $storage)
    {
        $this->storage = $storage;
    }

    public function preUpload(Event $event)
    {
        $uploadDir = $event->getMapping()->getUploadDestination();
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true); // Ensure the directory is created recursively
        }
    }
}
